from app.schemas import GenerateRecipeRequest
from app.services.ai_generator import generate_recipe, suggest_substitutions
from app.services.nutrition import estimate_nutrition


def test_generate_recipe_uses_input_ingredients() -> None:
    result = generate_recipe(
        GenerateRecipeRequest(
            ingredients=["paneer", "bell pepper", "onion"],
            preferred_cuisine="Indian",
            cooking_time=25,
            skill_level="Beginner",
        )
    )
    assert "Paneer" in result.title
    assert result.estimated_cooking_time == 25
    assert result.confidence >= 70


def test_nutrition_estimate_has_macros() -> None:
    nutrition = estimate_nutrition(["salmon", "rice"])
    assert nutrition["calories"] > 300
    assert nutrition["protein"] > 20


def test_vegan_substitutions_filter_dairy() -> None:
    result = suggest_substitutions("paneer", "vegan")
    assert "tofu" in result["substitutions"]
    assert "halloumi" not in result["substitutions"]

