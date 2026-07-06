from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import PantryItem, User
from app.schemas import PantryItemCreate, PantryItemRead


router = APIRouter(prefix="/pantry", tags=["pantry"])


@router.get("", response_model=list[PantryItemRead])
def pantry(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[PantryItem]:
    return db.query(PantryItem).filter(PantryItem.user_id == current_user.id).order_by(PantryItem.name).all()


@router.post("", response_model=PantryItemRead)
def add_item(payload: PantryItemCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> PantryItem:
    item = PantryItem(user_id=current_user.id, **payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=PantryItemRead)
def update_item(item_id: int, payload: PantryItemCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> PantryItem:
    item = db.get(PantryItem, item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Pantry item not found")
    for key, value in payload.model_dump().items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}")
def delete_item(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict[str, str]:
    item = db.get(PantryItem, item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Pantry item not found")
    db.delete(item)
    db.commit()
    return {"message": "Pantry item removed"}


@router.get("/alerts")
def alerts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict[str, list[str]]:
    items = db.query(PantryItem).filter(PantryItem.user_id == current_user.id).all()
    today = date.today()
    expiring = [item.name for item in items if item.expiry_date and item.expiry_date <= today + timedelta(days=3)]
    low_stock = [item.name for item in items if item.quantity <= item.low_stock_threshold]
    return {"expiring": expiring, "low_stock": low_stock}

