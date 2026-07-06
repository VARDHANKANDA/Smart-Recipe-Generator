from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import MealPlan, Recipe, User
from app.schemas import MealPlanCreate


router = APIRouter(prefix="/planner", tags=["planner"])


@router.get("/week")
def week(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict[str, list[dict[str, object]]]:
    today = date.today()
    start = today - timedelta(days=today.weekday())
    end = start + timedelta(days=7)
    plans = db.query(MealPlan).filter(MealPlan.user_id == current_user.id, MealPlan.planned_date >= start, MealPlan.planned_date < end).all()
    recipes = {recipe.id: recipe for recipe in db.query(Recipe).filter(Recipe.id.in_([plan.recipe_id for plan in plans] or [0])).all()}
    grouped: dict[str, list[dict[str, object]]] = {}
    for plan in plans:
        recipe = recipes.get(plan.recipe_id)
        grouped.setdefault(plan.planned_date.isoformat(), []).append(
            {"id": plan.id, "slot": plan.slot, "recipe": {"id": recipe.id, "title": recipe.title, "calories": recipe.calories} if recipe else None}
        )
    return grouped


@router.post("/week")
def add_to_week(payload: MealPlanCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict[str, str]:
    if not db.get(Recipe, payload.recipe_id):
        raise HTTPException(status_code=404, detail="Recipe not found")
    db.add(MealPlan(user_id=current_user.id, **payload.model_dump()))
    db.commit()
    return {"message": "Meal added to planner"}


@router.delete("/{plan_id}")
def remove_plan(plan_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict[str, str]:
    plan = db.get(MealPlan, plan_id)
    if not plan or plan.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Meal plan item not found")
    db.delete(plan)
    db.commit()
    return {"message": "Meal removed"}


@router.get("/nutrition-summary")
def nutrition_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict[str, float]:
    plans = db.query(MealPlan).filter(MealPlan.user_id == current_user.id).all()
    recipes = db.query(Recipe).filter(Recipe.id.in_([plan.recipe_id for plan in plans] or [0])).all()
    return {
        "calories": sum(recipe.calories for recipe in recipes),
        "protein": round(sum(recipe.protein for recipe in recipes), 1),
        "carbs": round(sum(recipe.carbs for recipe in recipes), 1),
        "fat": round(sum(recipe.fat for recipe in recipes), 1),
    }

