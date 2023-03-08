import pika
import json
import os
import uuid
import aiohttp
from datetime import datetime
from typing import Dict, List
from asgiref.sync import sync_to_async

from api.models import Formula, FormulaLegacy
from api.serializers import FormulaSerializer, FormulaLegacySerializer

from dotenv import load_dotenv
load_dotenv()


def to_json(obj):
    return json.dumps(obj, default=lambda obj: obj.__dict__)

async def execute_algorithm(
    url_key: str, 
    body: Dict[str, any]
) -> Dict[str, any]:
    try:
        async with aiohttp.ClientSession() as session:
            url = os.getenv(url_key)
            response = await session.post(
                url, json=body
            )
            result = await response.text()
            return json.loads(result)
    except Exception as e:
        print(f"Error occurred: {e}")
        return None
    
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

def get_formula_by_stage(
    stage: int, 
    workspace_id: int
) -> List[FormulaLegacy]:
    try:
        formulas = list(FormulaLegacy.objects.filter(
            stage=stage,
            workspace_id=workspace_id
        ))
        return formulas
    except Exception as e:
        print(f"Error occurred: {e}")
        return None

@sync_to_async
def save_bulk_formula(
    stage: int, 
    workspace_id: str,
    conclusion_id: str,
    names: List[str],
    ids: List[str],
    jsons: List[Dict[str, any]],
    strings: List[str]
) -> bool:
    existing = list(FormulaLegacy.objects.filter(
        stage=stage,
        workspace_id=workspace_id
    ))
    normalized = list(zip(names, jsons, strings, ids))

    for formula in existing:
        formula.delete()

    to_create = []
    for (name, f_json, f_string, f_id) in normalized:
        print(f_id, conclusion_id)
        to_create.append({
            'name': name,
            'is_conclusion': f_id == conclusion_id,
            'formula_postfix': None,
            'formula_infix': None,
            'formula_json': f_json,
            'formula_result': f_string,
            'stage': stage,
            'workspace_id': workspace_id,
            'formula_id': f_id
        })

    saved = False
    create_serializer = FormulaLegacySerializer(data=to_create, many=True)
    if create_serializer.is_valid():
        try:
            create_serializer.save()
            saved = True
        except Exception as e:
            print(f"Error occurred: {e}")
    else:
        print(f"Error occurred: {create_serializer.errors}")

    return saved
