# SmartChef AI API

Base URL: `/api/v1`

Authentication uses a JWT bearer token:

```http
Authorization: Bearer <token>
```

## Auth

| Method | Path | Description |
| --- | --- | --- |
| POST | `/auth/register` | Create a user account |
| POST | `/auth/login` | Login and receive JWT token |
| GET | `/auth/me` | Current user profile |
| POST | `/auth/forgot-password` | Simulated password reset flow |
| POST | `/auth/verify-email` | Simulated email verification |

## Recipes

| Method | Path | Description |
| --- | --- | --- |
| GET | `/recipes` | Search recipes with filters and pagination |
| GET | `/recipes/{id}` | Recipe details |
| GET | `/recipes/trending/list` | Trending recipes |
| GET | `/recipes/{id}/similar` | Similar recipes using TF-IDF |
| POST | `/recipes/{id}/favorite` | Save recipe |
| DELETE | `/recipes/{id}/favorite` | Remove saved recipe |
| POST | `/recipes/{id}/reviews` | Add rating and review |

## AI

| Method | Path | Description |
| --- | --- | --- |
| POST | `/ai/generate-recipe` | Generate recipe from ingredients and preferences |
| POST | `/ai/recommendations` | Personalized recommendations |
| POST | `/ai/substitutions` | Ingredient substitution suggestions |
| POST | `/ai/nutrition` | Nutrition estimate for ingredients |

## Pantry

| Method | Path | Description |
| --- | --- | --- |
| GET | `/pantry` | List pantry items |
| POST | `/pantry` | Add pantry item |
| PUT | `/pantry/{id}` | Update pantry item |
| DELETE | `/pantry/{id}` | Remove pantry item |
| GET | `/pantry/alerts` | Expiry and low-stock alerts |

## Meal Planner

| Method | Path | Description |
| --- | --- | --- |
| GET | `/planner/week` | Weekly plan |
| POST | `/planner/week` | Add meal to a day/slot |
| DELETE | `/planner/{id}` | Remove meal |
| GET | `/planner/nutrition-summary` | Weekly nutrition totals |

## Shopping List

| Method | Path | Description |
| --- | --- | --- |
| GET | `/shopping-list` | Current shopping list |
| POST | `/shopping-list/generate` | Generate from meal plan and pantry |
| PATCH | `/shopping-list/{id}/toggle` | Check/uncheck item |
| DELETE | `/shopping-list/clear` | Clear list |

## Admin

Admin endpoints require `role=admin`.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/admin/analytics` | Dashboard metrics and charts |
| GET | `/admin/users` | User management list |
| GET | `/admin/recipes` | Recipe management list |

