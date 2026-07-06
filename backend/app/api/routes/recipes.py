from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import Favorite, Recipe, Review, User
from app.schemas import Recommendation, RecipeRead, RecipeSearchResponse, ReviewCreate
from app.services.recommender import search_recipes, similar_recipes, trending_score


router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.get("", response_model=RecipeSearchResponse)
def list_recipes(
    q: str = "",
    ingredients: list[str] = Query(default=[]),
    cuisine: str | None = None,
    diet: str | None = None,
    max_time: int | None = None,
    max_calories: int | None = None,
    difficulty: str | None = None,
    sort: str = "ai",
    page: int = 1,
    page_size: int = 12,
    db: Session = Depends(get_db),
) -> RecipeSearchResponse:
    recipes = search_recipes(db, q, ingredients, cuisine, diet, max_time, max_calories, difficulty, sort)
    start = (page - 1) * page_size
    return RecipeSearchResponse(items=recipes[start : start + page_size], total=len(recipes), page=page, page_size=page_size)


@router.get("/trending/list", response_model=list[RecipeRead])
def trending(db: Session = Depends(get_db)) -> list[Recipe]:
    return sorted(db.query(Recipe).all(), key=trending_score, reverse=True)[:10]


@router.get("/{recipe_id}", response_model=RecipeRead)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)) -> Recipe:
    recipe = db.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    recipe.views += 1
    db.commit()
    db.refresh(recipe)
    return recipe


@router.get("/{recipe_id}/similar", response_model=list[Recommendation])
def get_similar(recipe_id: int, db: Session = Depends(get_db)) -> list[Recommendation]:
    return [
        Recommendation(recipe=item.recipe, confidence=item.confidence, reasons=item.reasons)
        for item in similar_recipes(db, recipe_id)
    ]


@router.post("/{recipe_id}/favorite")
def favorite(recipe_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict[str, str]:
    recipe = db.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    existing = db.get(Favorite, {"user_id": current_user.id, "recipe_id": recipe_id})
    if not existing:
        db.add(Favorite(user_id=current_user.id, recipe_id=recipe_id))
        recipe.saves += 1
        db.commit()
    return {"message": "Recipe saved"}


@router.delete("/{recipe_id}/favorite")
def unfavorite(recipe_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict[str, str]:
    favorite_row = db.get(Favorite, {"user_id": current_user.id, "recipe_id": recipe_id})
    if favorite_row:
        db.delete(favorite_row)
        db.commit()
    return {"message": "Recipe removed from favorites"}


@router.post("/{recipe_id}/reviews")
def add_review(
    recipe_id: int,
    payload: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    if not db.get(Recipe, recipe_id):
        raise HTTPException(status_code=404, detail="Recipe not found")
    db.add(Review(user_id=current_user.id, recipe_id=recipe_id, rating=payload.rating, comment=payload.comment))
    db.commit()
    return {"message": "Review published"}

