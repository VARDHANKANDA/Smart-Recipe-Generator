from dataclasses import dataclass
from math import log1p
from sqlalchemy.orm import Session
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.models import Favorite, PantryItem, Recipe, User


@dataclass
class RecommendationResult:
    recipe: Recipe
    confidence: int
    reasons: list[str]


def _recipe_document(recipe: Recipe) -> str:
    return " ".join(
        [
            recipe.title,
            recipe.cuisine,
            recipe.diet,
            recipe.difficulty,
            " ".join(recipe.ingredients or []),
            " ".join(recipe.instructions or []),
            " ".join(recipe.tags or []),
        ]
    ).lower()


def trending_score(recipe: Recipe) -> float:
    return recipe.rating * 12 + log1p(recipe.views) * 6 + log1p(recipe.saves) * 10


def search_recipes(
    db: Session,
    query: str = "",
    ingredients: list[str] | None = None,
    cuisine: str | None = None,
    diet: str | None = None,
    max_time: int | None = None,
    max_calories: int | None = None,
    difficulty: str | None = None,
    sort: str = "ai",
) -> list[Recipe]:
    recipes = db.query(Recipe).all()
    terms = [query.lower(), *(item.lower() for item in ingredients or [])]

    def matches(recipe: Recipe) -> bool:
        text = _recipe_document(recipe)
        if cuisine and cuisine.lower() not in recipe.cuisine.lower():
            return False
        if diet and diet.lower() not in recipe.diet.lower():
            return False
        if difficulty and difficulty.lower() != recipe.difficulty.lower():
            return False
        if max_time and recipe.total_time > max_time:
            return False
        if max_calories and recipe.calories > max_calories:
            return False
        return all(term in text for term in terms if term)

    filtered = [recipe for recipe in recipes if matches(recipe)]
    if sort == "rating":
        return sorted(filtered, key=lambda recipe: recipe.rating, reverse=True)
    if sort == "time":
        return sorted(filtered, key=lambda recipe: recipe.total_time)
    if sort == "calories":
        return sorted(filtered, key=lambda recipe: recipe.calories)
    return sorted(filtered, key=trending_score, reverse=True)


def similar_recipes(db: Session, recipe_id: int, limit: int = 6) -> list[RecommendationResult]:
    recipes = db.query(Recipe).all()
    if len(recipes) <= 1:
        return []
    index = next((idx for idx, recipe in enumerate(recipes) if recipe.id == recipe_id), None)
    if index is None:
        return []
    docs = [_recipe_document(recipe) for recipe in recipes]
    matrix = TfidfVectorizer(stop_words="english").fit_transform(docs)
    scores = cosine_similarity(matrix[index], matrix).flatten()
    ranked = sorted(
        [(recipe, scores[idx]) for idx, recipe in enumerate(recipes) if recipe.id != recipe_id],
        key=lambda item: item[1],
        reverse=True,
    )
    return [
        RecommendationResult(recipe=recipe, confidence=max(55, round(score * 100)), reasons=["Similar ingredients", "Matching cuisine profile"])
        for recipe, score in ranked[:limit]
    ]


def personalized_recommendations(db: Session, user: User, limit: int = 8) -> list[RecommendationResult]:
    recipes = db.query(Recipe).all()
    favorite_ids = {fav.recipe_id for fav in db.query(Favorite).filter(Favorite.user_id == user.id).all()}
    pantry = {item.name.lower() for item in db.query(PantryItem).filter(PantryItem.user_id == user.id).all()}
    preferences = f"{user.dietary_preferences} {user.allergies}".lower()
    scored: list[tuple[Recipe, float, list[str]]] = []

    for recipe in recipes:
        if recipe.id in favorite_ids:
            continue
        score = trending_score(recipe)
        reasons = ["Trending with SmartChef users"]
        overlap = pantry.intersection({ingredient.lower() for ingredient in recipe.ingredients})
        if overlap:
            score += len(overlap) * 18
            reasons.append(f"Uses pantry items: {', '.join(sorted(overlap)[:3])}")
        if recipe.diet.lower() in preferences or recipe.cuisine.lower() in preferences:
            score += 25
            reasons.append("Matches your preferences")
        if any(allergy.strip() and allergy.strip().lower() in _recipe_document(recipe) for allergy in user.allergies.split(",")):
            score -= 100
            reasons.append("Review allergy suitability before cooking")
        scored.append((recipe, score, reasons))

    ranked = sorted(scored, key=lambda item: item[1], reverse=True)[:limit]
    if not ranked:
        return []
    max_score = max(score for _, score, _ in ranked) or 1
    return [
        RecommendationResult(recipe=recipe, confidence=min(98, max(62, round(score / max_score * 100))), reasons=reasons)
        for recipe, score, reasons in ranked
    ]

