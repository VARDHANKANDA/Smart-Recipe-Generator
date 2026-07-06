from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import User
from app.schemas import GeneratedRecipe, GenerateRecipeRequest, Recommendation
from app.services.ai_generator import generate_recipe, suggest_substitutions
from app.services.nutrition import estimate_nutrition
from app.services.recommender import personalized_recommendations


router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/generate-recipe", response_model=GeneratedRecipe)
def generate(payload: GenerateRecipeRequest) -> GeneratedRecipe:
    return generate_recipe(payload)


@router.post("/recommendations", response_model=list[Recommendation])
def recommendations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[Recommendation]:
    return [
        Recommendation(recipe=item.recipe, confidence=item.confidence, reasons=item.reasons)
        for item in personalized_recommendations(db, current_user)
    ]


@router.post("/substitutions")
def substitutions(ingredient: str, diet: str = "") -> dict[str, object]:
    return suggest_substitutions(ingredient, diet)


@router.post("/nutrition")
def nutrition(ingredients: list[str]) -> dict[str, float]:
    return estimate_nutrition(ingredients)

