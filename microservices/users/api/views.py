import json
from django.contrib.auth.models import User
from django.contrib.auth import login
from django.views import View
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(View):

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))

        user = User.objects.create_user(
            data.get("username"), 
            data.get('email'), 
            data.get('password')
        )
        if user:
            login(request, user)
            return JsonResponse(
                {'message': 'User registered successfully'}
            )
        else:
            return JsonResponse(
                {'error': 'Unable to register user'}, 
                status=400
            )