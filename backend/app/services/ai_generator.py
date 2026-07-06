from app.schemas import GeneratedRecipe, GenerateRecipeRequest
from app.services.nutrition import estimate_nutrition


ESSENTIALS = {
    "Indian": ["garam masala", "ginger", "cilantro"],
    "Italian": ["olive oil", "basil", "parmesan"],
    "Thai": ["coconut milk", "lime", "thai curry paste"],
    "Mediterranean": ["lemon", "olive oil", "parsley"],
    "Global": ["salt", "pepper", "olive oil"],
}


def generate_recipe(request: GenerateRecipeRequest) -> GeneratedRecipe:
    cuisine = request.preferred_cuisine or "Global"
    base = [item.strip().lower() for item in request.ingredients if item.strip()]
    essentials = ESSENTIALS.get(cuisine, ESSENTIALS["Global"])
    missing = [item for item in essentials if item not in " ".join(base)]
    protein_hint = next((item for item in base if item in {"paneer", "chicken", "tofu", "salmon", "egg", "lentils", "chickpeas"}), base[0] if base else "vegetables")
    title = f"{cuisine} {protein_hint.title()} Smart Skillet"
    cooking_time = min(max(request.cooking_time, 12), 75)
    all_ingredients = base + missing
    nutrition = estimate_nutrition(all_ingredients)
    instructions = [
        "Wash, chop, and group ingredients by cooking time.",
        f"Build a flavor base with {', '.join(missing[:2]) if missing else 'aromatics'} over medium heat.",
        f"Add {protein_hint} and cook until the texture is tender and lightly caramelized.",
        "Fold in the remaining ingredients, season gradually, and simmer until balanced.",
        "Plate with a fresh garnish and taste once more before serving.",
    ]
    explanation = (
        f"The recipe prioritizes your available ingredients, keeps the method suitable for a "
        f"{request.skill_level.lower()} cook, and uses {cuisine.lower()} flavor cues for coherence."
    )
    confidence = 92 if len(base) >= 4 else 78
    return GeneratedRecipe(
        title=title,
        ingredients=all_ingredients,
        missing_ingredients=missing,
        instructions=instructions,
        nutrition=nutrition,
        ai_explanation=explanation,
        estimated_cooking_time=cooking_time,
        confidence=confidence,
    )


SUBSTITUTIONS = {
    "egg": ["silken tofu", "flaxseed gel", "chickpea flour batter"],
    "milk": ["oat milk", "soy milk", "coconut milk"],
    "butter": ["olive oil", "ghee", "avocado oil"],
    "paneer": ["tofu", "halloumi", "cottage cheese"],
    "rice": ["quinoa", "millet", "cauliflower rice"],
    "cream": ["cashew cream", "coconut cream", "greek yogurt"],
}


def suggest_substitutions(ingredient: str, diet: str = "") -> dict[str, object]:
    key = ingredient.lower().strip()
    options = SUBSTITUTIONS.get(key, ["seasonal vegetables", "mushrooms", "lentils"])
    if "vegan" in diet.lower():
        options = [item for item in options if item not in {"ghee", "greek yogurt", "halloumi", "cottage cheese"}]
    return {"ingredient": ingredient, "substitutions": options[:3], "confidence": 86}

