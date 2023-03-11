from typing import List
import pika
import json
import os
import uuid
from api.serializers import FormulaSerializer

from dotenv import load_dotenv

from api.models import Formula
load_dotenv()

    
def sync_formulas(workspace_id: int):
    rabbitmq_uri = os.getenv('RABBITMQ_URI')
    params = pika.URLParameters(rabbitmq_uri)
    connection = pika.BlockingConnection(params)
    channel = connection.channel()

    formulas = get_formula_by_workspace(workspace_id)
    channel.basic_publish(
        exchange='formulas', 
        routing_key='',
        body=json.dumps(
            FormulaSerializer.rabbitmq(formulas)
        )
    )

def get_formula(pk) -> Formula:
    try:
        return Formula.objects.get(pk=uuid.UUID(pk))
    except:
        return None
    
def get_formula_by_workspace(
    workspace_id: int
) -> List[Formula]:
    try:
        formulas = list(Formula.objects.filter(
            workspace_id=workspace_id
        ))
        return formulas
    except Exception as e:
        print(f"Error occurred: {e}")
        return None

