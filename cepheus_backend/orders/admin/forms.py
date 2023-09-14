from django import forms

from ckeditor.widgets import CKEditorWidget

from ..models import Good


class GoodAdminForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorWidget(), required=False)

    class Meta:
        model = Good
        fields = '__all__'
