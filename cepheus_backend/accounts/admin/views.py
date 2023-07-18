from django.http import JsonResponse
from django.views import View
from django.contrib import messages

from email_notifications.utils import send_pass_generations
from accounts.models import Account


class SendEmail(View):
    def post(self, request):
        has_permission = bool(request.user and request.user.is_superuser)
        if not has_permission:
            return JsonResponse(data={'detail': 'Is not allowed'})
        try:
            user = Account.objects.get(pk=request.POST.get('user_id'))
            send_pass_generations(user)
        except Exception:
            messages.warning(request, 'Sending email was failed')
            return JsonResponse(data={})
        messages.success(request, 'Ok')
        return JsonResponse(data={})
