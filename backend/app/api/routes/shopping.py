from collections import Counter
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import MealPlan, PantryItem, Recipe, ShoppingItem, User
from app.schemas import ShoppingItemRead


router = APIRouter(prefix="/shopping-list", tags=["shopping-list"])


@router.get("", response_model=list[ShoppingItemRead])
def list_items(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[ShoppingItem]:
    return db.query(ShoppingItem).filter(ShoppingItem.user_id == current_user.id).order_by(ShoppingItem.category, ShoppingItem.name).all()


@router.post("/generate", response_model=list[ShoppingItemRead])
def generate(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[ShoppingItem]:
    pantry = {item.name.lower() for item in db.query(PantryItem).filter(PantryItem.user_id == current_user.id).all()}
    plans = db.query(MealPlan).filter(MealPlan.user_id == current_user.id).all()
    recipes = db.query(Recipe).filter(Recipe.id.in_([plan.recipe_id for plan in plans] or [0])).all()
    needed = Counter(
        ingredient.lower()
        for recipe in recipes
        for ingredient in recipe.ingredients
        if ingredient.lower() not in pantry
    )
    db.query(ShoppingItem).filter(ShoppingItem.user_id == current_user.id).delete()
    items = [
        ShoppingItem(user_id=current_user.id, name=name.title(), quantity=count, unit="pack", category="Meal Plan", checked=False)
        for name, count in needed.items()
    ]
    db.add_all(items)
    db.commit()
    return list_items(current_user, db)


@router.patch("/{item_id}/toggle", response_model=ShoppingItemRead)
def toggle(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> ShoppingItem:
    item = db.get(ShoppingItem, item_id)
    item.checked = not item.checked
    db.commit()
    db.refresh(item)
    return item


@router.delete("/clear")
def clear(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict[str, str]:
    db.query(ShoppingItem).filter(ShoppingItem.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Shopping list cleared"}

