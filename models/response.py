from pydantic import BaseModel
from typing import Union, List
from models import TodoItem


class Result(BaseModel):
    data: Union[str, dict, List[TodoItem], None]
    status: bool
    message: str
