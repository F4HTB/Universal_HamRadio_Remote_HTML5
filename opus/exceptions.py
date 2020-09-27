from opus.api.info import strerror


class OpusError(Exception):

    def __init__(self, code):
        self.code = code

    def __str__(self):
        return strerror(self.code)
