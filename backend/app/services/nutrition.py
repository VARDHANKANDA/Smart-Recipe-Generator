NUTRITION_LOOKUP: dict[str, dict[str, float]] = {
    "chicken": {"calories": 165, "protein": 31, "carbs": 0, "fat": 3.6},
    "paneer": {"calories": 296, "protein": 18, "carbs": 6, "fat": 22},
    "rice": {"calories": 130, "protein": 2.7, "carbs": 28, "fat": 0.3},
    "lentils": {"calories": 116, "protein": 9, "carbs": 20, "fat": 0.4},
    "egg": {"calories": 78, "protein": 6, "carbs": 0.6, "fat": 5},
    "avocado": {"calories": 160, "protein": 2, "carbs": 9, "fat": 15},
    "salmon": {"calories": 208, "protein": 20, "carbs": 0, "fat": 13},
    "chickpeas": {"calories": 164, "protein": 9, "carbs": 27, "fat": 2.6},
    "quinoa": {"calories": 120, "protein": 4.4, "carbs": 21, "fat": 1.9},
    "vegetables": {"calories": 45, "protein": 2, "carbs": 9, "fat": 0.5},
}


def estimate_nutrition(ingredients: list[str]) -> dict[str, float]:
    totals = {"calories": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0}
    for ingredient in ingredients:
        key = ingredient.lower()
        match = next((value for name, value in NUTRITION_LOOKUP.items() if name in key), None)
        if match is None:
            match = {"calories": 55, "protein": 2, "carbs": 8, "fat": 1.5}
        for nutrient, value in match.items():
            totals[nutrient] += value
    return {key: round(value, 1) for key, value in totals.items()}

