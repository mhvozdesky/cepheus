import os


def get_base_url():
    protocol = os.environ.get('CEPHEUS_PROTOCOL')
    host = os.environ.get('CEPHEUS_HOST')
    port = os.environ.get('CEPHEUS_PORT')
    return f'{protocol}://{host}:{port}'
