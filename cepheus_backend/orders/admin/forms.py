from django import forms

from ckeditor.widgets import CKEditorWidget

from ..models import Good


class GoodAdminForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorWidget())

    class Meta:
        model = Good
        fields = '__all__'
