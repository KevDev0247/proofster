import json
import os
import aiohttp
from asgiref.sync import sync_to_async

from .models import Formula
from .serializers import FormulaSerializer


async def execute_algorithm(url_key, body):
    try:
        async with aiohttp.ClientSession() as session:
            url = os.getenv(url_key)
            response = await session.post(
                url, json={body}
            )
            result = await response.text()
            return json.loads(result)
    except Exception as e:
        print(f"Error occurred: {e}")
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

async def create_bulk_formula(data, stage, workspace_id):
    formulas = zip(data['names'], data['jsons'], data['strings'])
    to_save = []
    for f, (name, f_string, f_json) in enumerate(formulas):
        to_save.append({
            'name': name,
            'is_conclusion': f == len(formulas) - 1,
            'formula_json': f_json,
            'formula_result': f_string,
            'stage': stage,
            'workspace_id': workspace_id
        })

    serializer = FormulaSerializer(data=to_save, many=True)
    if await sync_to_async(serializer.is_valid)():
        results = await sync_to_async(
            Formula.objects.bulk_create(serializer.data)
        )
        return results
    else:
        return None
