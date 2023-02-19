import json
import os
import uuid
import aiohttp
from asgiref.sync import sync_to_async

from .models import Formula
from .serializers import FormulaSerializer


async def execute_algorithm(url_key, body):
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

def get_formula(pk):
    try:
        return Formula.objects.get(pk=uuid.UUID(pk))
    except:
        return None

@sync_to_async
def get_formula_by_stage(stage, workspace_id):
    try:
        formulas = list(Formula.objects.filter(
            stage=stage,
            workspace_id=workspace_id
        ))
        return formulas
    except Exception as e:
        print(f"Error occurred: {e}")
        return None

@sync_to_async
def save_bulk_formula(data, stage, workspace_id):
    existing = list(Formula.objects.filter(
        stage=stage,
        workspace_id=workspace_id
    ))
    normalized = list(zip(
        data['names'], data['jsons'], data['strings'], data['ids']
    ))
    conclusion_ids = [
        formula.id 
        for formula in existing 
        if formula.is_conclusion
    ]

    to_create, to_update, to_delete = [], [], []
    if len(normalized) >= len(existing):
        to_update_partial = normalized.copy()
        existing_ids = [curr.formula_id for curr in existing]
        
        to_drop = []
        for (name, f_json, f_string, f_id) in normalized:
            if f_id not in existing_ids:
                to_create.append({
                    'name': name,
                    'is_conclusion': f_id in conclusion_ids,
                    'formula_postfix': None,
                    'formula_json': f_json,
                    'formula_result': f_string,
                    'stage': stage,
                    'workspace_id': workspace_id,
                    'formula_id': f_id
                })
                to_drop.append((name, f_json, f_string, f_id))

        to_update_partial = list(filter(
            lambda x: x not in to_drop,
            to_update_partial
        ))
        joined = list(zip(to_update_partial, existing))
        for ((name, f_json, f_string, f_id), curr) in joined:
            curr.name = name
            curr.formula_json = f_json
            curr.formula_result = f_string
            to_update.append(curr)      
    else:
        to_delete = existing.copy()
        normalized_ids = data['ids']

        to_drop = []
        for curr in existing:
            if curr.formula_id in normalized_ids:
                curr.name = name
                curr.formula_json = f_json
                curr.formula_result = f_string
                to_update.append(curr)
            to_drop.append(curr)
            
        to_delete = list(filter(
            lambda x: x not in to_drop,
            to_delete
        ))

    created = False
    create_serializer = FormulaSerializer(data=to_create, many=True)
    if create_serializer.is_valid():
        try:
            create_serializer.save()
            created = True
        except Exception as e:
            print(f"Error occurred: {e}")
    else:
        print(f"Error occurred: {create_serializer.errors}")

    updated = False
    update_serializer = FormulaSerializer(data=to_update, many=True)
    if update_serializer.is_valid():
        try:
            update_serializer.save()
            updated = True
        except Exception as e:
            print(f"Error occurred: {e}")
    else:
        print(f"Error occurred: {update_serializer.errors}")

    for formula in to_delete:
        formula.delete()

    return created and updated
