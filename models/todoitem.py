from redis_om import (Field, JsonModel)


class TodoItem(JsonModel):
    item: str = Field(index=True)
    status: str = Field(index=True, default='active')
