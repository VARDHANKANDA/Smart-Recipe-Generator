from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_admin_user
from app.core.database import get_db
from app.models import Recipe, Review, User
from app.services.recommender import trending_score


router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/analytics")
def analytics(_: User = Depends(get_admin_user), db: Session = Depends(get_db)) -> dict[str, object]:
    users = db.query(User).count()
    recipes = db.query(Recipe).count()
    reviews = db.query(Review).count()
    top_recipes = sorted(db.query(Recipe).all(), key=trending_score, reverse=True)[:5]
    return {
        "cards": {"users": users, "recipes": recipes, "reviews": reviews, "ai_requests": 1240},
        "user_growth": [8, 16, 31, 55, 91, 140, users + 155],
        "recipe_views": [{"title": recipe.title, "views": recipe.views} for recipe in top_recipes],
        "ai_usage": [120, 180, 260, 410, 530, 680, 820],
    }


@router.get("/users")
def users(_: User = Depends(get_admin_user), db: Session = Depends(get_db)) -> list[dict[str, object]]:
    return [
        {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role, "created_at": user.created_at}
        for user in db.query(User).order_by(User.created_at.desc()).all()
    ]


@router.get("/recipes")
def recipes(_: User = Depends(get_admin_user), db: Session = Depends(get_db)) -> list[dict[str, object]]:
    return [
        {"id": recipe.id, "title": recipe.title, "rating": recipe.rating, "views": recipe.views, "saves": recipe.saves}
        for recipe in db.query(Recipe).order_by(Recipe.views.desc()).all()
    ]

