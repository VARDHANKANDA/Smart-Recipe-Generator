from datetime import date, datetime
from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    dietary_preferences: str = ""
    allergies: str = ""
    avatar_url: str | None = None


class UserCreate(UserBase):
    password: str = Field(min_length=8)


class UserRead(UserBase):
    id: int
    role: str
    created_at: datetime

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RecipeRead(BaseModel):
    id: int
    title: str
    slug: str
    cuisine: str
    difficulty: str
    diet: str
    calories: int
    protein: float
    carbs: float
    fat: float
    prep_time: int
    cook_time: int
    servings: int
    image_url: str | None = None
    video_url: str | None = None
    ingredients: list[str]
    instructions: list[str]
    tags: list[str]
    rating: float
    views: int
    saves: int
    created_at: datetime

    model_config = {"from_attributes": True}


class RecipeSearchResponse(BaseModel):
    items: list[RecipeRead]
    total: int
    page: int
    page_size: int


class Recommendation(BaseModel):
    recipe: RecipeRead
    confidence: int
    reasons: list[str]


class GenerateRecipeRequest(BaseModel):
    ingredients: list[str]
    preferred_cuisine: str = "Global"
    cooking_time: int = 30
    dietary_restrictions: list[str] = []
    skill_level: str = "Beginner"


class GeneratedRecipe(BaseModel):
    title: str
    ingredients: list[str]
    missing_ingredients: list[str]
    instructions: list[str]
    nutrition: dict[str, float]
    ai_explanation: str
    estimated_cooking_time: int
    confidence: int


class PantryItemCreate(BaseModel):
    name: str
    quantity: float
    unit: str = "pcs"
    category: str = "General"
    expiry_date: date | None = None
    low_stock_threshold: float = 1


class PantryItemRead(PantryItemCreate):
    id: int
    user_id: int

    model_config = {"from_attributes": True}


class MealPlanCreate(BaseModel):
    recipe_id: int
    planned_date: date
    slot: str


class ShoppingItemRead(BaseModel):
    id: int
    name: str
    quantity: float
    unit: str
    category: str
    checked: bool

    model_config = {"from_attributes": True}

class ReviewCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: str = ""

