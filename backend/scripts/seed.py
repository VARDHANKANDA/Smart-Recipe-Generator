import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.database import Base, SessionLocal, engine
from app.core.security import get_password_hash
from app.models import PantryItem, Recipe, User


RECIPES = [
    {
        "title": "Mediterranean Chickpea Power Bowl",
        "slug": "mediterranean-chickpea-power-bowl",
        "cuisine": "Mediterranean",
        "difficulty": "Easy",
        "diet": "Vegetarian",
        "calories": 520,
        "protein": 22,
        "carbs": 64,
        "fat": 18,
        "prep_time": 12,
        "cook_time": 8,
        "servings": 2,
        "image_url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
        "video_url": "",
        "ingredients": ["chickpeas", "cucumber", "tomato", "feta", "olive oil", "lemon", "quinoa"],
        "instructions": ["Cook quinoa until fluffy.", "Season chickpeas.", "Layer vegetables and grains.", "Finish with herbs."],
        "tags": ["protein", "lunch", "fresh", "quick"],
        "rating": 4.8,
        "views": 1280,
        "saves": 420,
    },
    {
        "title": "Paneer Tikka Millet Wrap",
        "slug": "paneer-tikka-millet-wrap",
        "cuisine": "Indian",
        "difficulty": "Medium",
        "diet": "Vegetarian",
        "calories": 610,
        "protein": 31,
        "carbs": 70,
        "fat": 22,
        "prep_time": 20,
        "cook_time": 18,
        "servings": 3,
        "image_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80",
        "video_url": "",
        "ingredients": ["paneer", "yogurt", "millet roti", "bell pepper", "onion", "tikka masala", "mint"],
        "instructions": ["Marinate paneer.", "Roast with peppers.", "Warm rotis.", "Roll with chutney."],
        "tags": ["indian", "high protein", "dinner"],
        "rating": 4.7,
        "views": 980,
        "saves": 310,
    },
    {
        "title": "Garlic Butter Salmon Rice Bowl",
        "slug": "garlic-butter-salmon-rice-bowl",
        "cuisine": "Japanese Fusion",
        "difficulty": "Medium",
        "diet": "High Protein",
        "calories": 690,
        "protein": 42,
        "carbs": 58,
        "fat": 30,
        "prep_time": 10,
        "cook_time": 16,
        "servings": 2,
        "image_url": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
        "video_url": "",
        "ingredients": ["salmon", "rice", "garlic", "butter", "soy sauce", "broccoli", "sesame"],
        "instructions": ["Cook rice.", "Sear salmon.", "Add garlic butter.", "Serve with broccoli."],
        "tags": ["omega 3", "dinner", "balanced"],
        "rating": 4.9,
        "views": 1520,
        "saves": 540,
    },
    {
        "title": "Thai Coconut Lentil Soup",
        "slug": "thai-coconut-lentil-soup",
        "cuisine": "Thai",
        "difficulty": "Easy",
        "diet": "Vegan",
        "calories": 430,
        "protein": 18,
        "carbs": 52,
        "fat": 16,
        "prep_time": 10,
        "cook_time": 24,
        "servings": 4,
        "image_url": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
        "video_url": "",
        "ingredients": ["red lentils", "coconut milk", "ginger", "garlic", "lime", "carrot", "thai curry paste"],
        "instructions": ["Saute aromatics.", "Simmer lentils.", "Add coconut milk.", "Finish with lime."],
        "tags": ["vegan", "soup", "comfort"],
        "rating": 4.6,
        "views": 760,
        "saves": 260,
    },
    {
        "title": "Avocado Egg Breakfast Toast",
        "slug": "avocado-egg-breakfast-toast",
        "cuisine": "American",
        "difficulty": "Easy",
        "diet": "Vegetarian",
        "calories": 390,
        "protein": 18,
        "carbs": 34,
        "fat": 21,
        "prep_time": 8,
        "cook_time": 6,
        "servings": 1,
        "image_url": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
        "video_url": "",
        "ingredients": ["sourdough", "avocado", "egg", "chili flakes", "lemon", "microgreens"],
        "instructions": ["Toast bread.", "Mash avocado.", "Cook egg.", "Assemble and season."],
        "tags": ["breakfast", "quick", "healthy fats"],
        "rating": 4.5,
        "views": 660,
        "saves": 180,
    },
]


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        student = db.query(User).filter(User.email == "student@smartchef.ai").first()
        if not student:
            student = User(
                email="student@smartchef.ai",
                full_name="Demo Student",
                hashed_password=get_password_hash("password123"),
                dietary_preferences="high protein, vegetarian friendly",
                allergies="peanuts",
            )
            db.add(student)
        if not db.query(User).filter(User.email == "admin@smartchef.ai").first():
            db.add(User(email="admin@smartchef.ai", full_name="Admin Chef", hashed_password=get_password_hash("admin123"), role="admin"))
        for item in RECIPES:
            if not db.query(Recipe).filter(Recipe.slug == item["slug"]).first():
                db.add(Recipe(**item))
        db.commit()
        db.refresh(student)
        if not db.query(PantryItem).filter(PantryItem.user_id == student.id).first():
            db.add_all(
                [
                    PantryItem(user_id=student.id, name="Chickpeas", quantity=2, unit="cans", category="Protein"),
                    PantryItem(user_id=student.id, name="Rice", quantity=1.5, unit="kg", category="Grains"),
                    PantryItem(user_id=student.id, name="Lemon", quantity=3, unit="pcs", category="Produce"),
                ]
            )
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    main()
