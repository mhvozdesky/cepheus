from django.http import JsonResponse
from django.views import View
from django.contrib import messages

from accounts.models import Account
from accounts.tasks import send_mail_delayed


class SendEmail(View):
    def post(self, request):
        has_permission = bool(request.user and request.user.is_superuser)
        if not has_permission:
            return JsonResponse(data={'detail': 'Is not allowed'}, status=403)
        try:
            user = Account.objects.get(pk=request.POST.get('user_id'))
            result = send_mail_delayed.delay('send_pass_generations', user.pk)
        except Exception:
            messages.warning(request, 'Sending email was failed')
            return JsonResponse(data={'detail': 'failed to send a message'}, status=500)
        messages.success(request, f'Message sending initiated. Task assigned {result.task_id}')
        return JsonResponse(data={'detail': 'Message sent successfully'}, status=200)

