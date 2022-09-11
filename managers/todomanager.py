from models import TodoItem, Result
from utils import Messages
from pydantic import ValidationError


class TodoManager:
    def set_todo(self, payload) -> Result:
        """
        Set a new todo item in redis.
        :param payload: {'item': string}
        :return: Result
        """
        item = payload.get('item')
        if not item:
            return Result(data=None, status=False, message=Messages.ERROR)
        try:
            new_sku = TodoItem(**{"item": item})
            new_sku.save()
        except ValidationError:
            return Result(data=None, status=False, message=Messages.ERROR)
        return Result(data=new_sku, status=True, message=Messages.SET_SUCCESS)

    def get_todo(self, request) -> Result:
        """
        Given a filter value, returns all todo present in redis.
        :param request: {'filter'='all|active|completed'}
        :return: Result
        """
        filter_value = request.args.get('filter')
        query = TodoItem.find()
        if filter_value == 'active':
            query = TodoItem.find(
                TodoItem.status == 'active'
            )
        elif filter_value == 'completed':
            query = TodoItem.find(
                TodoItem.status == 'completed'
            )
        items = query.all()
        return Result(data=items, status=True, message=Messages.GET_SUCCESS)

    def upsert_todo(self, payload) -> Result:
        """
        Upsert an item in redis
        :param payload: {'pk': string, 'item': string, 'status': string}
        :return: Result
        """
        try:
            item = TodoItem(**payload)
            item.save()
        except ValidationError:
            return Result(data=None, status=False, message=Messages.ERROR)
        return Result(data=None, status=True, message=Messages.UPSERT_SUCCESS)

    def delete_todos(self) -> Result:
        """
        Delete completed items in bulk.
        :return: Result
        """
        items = TodoItem.find(
            TodoItem.status == 'completed'
        ).all()
        for item in items:
            TodoItem.delete(item.pk)
        return Result(data=None, status=True, message=Messages.DELETE_SUCCESS)
