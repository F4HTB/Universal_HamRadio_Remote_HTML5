"""High-level interface to a opus.api.decoder functions"""

from opus.api import decoder, ctl


class Decoder(object):

    def __init__(self, fs, channels):
        """
        Parameters:
            fs : sampling rate
            channels : number of channels
        """

        self._fs = fs
        self._channels = channels
        self._state = decoder.create(fs, channels)

    def __del__(self):
        if hasattr(self, '_state'):
            # Destroying state only if __init__ completed successfully
            decoder.destroy(self._state)

    def reset_state(self):
        """Resets the codec state to be equivalent to a freshly initialized state"""

        decoder.ctl(self._state, ctl.reset_state)

    def decode(self, data, frame_size, decode_fec=False):
        return decoder.decode(self._state, data, len(data), frame_size, decode_fec, channels=self._channels)

    def decode_float(self, data, frame_size, decode_fec=False):
        return decoder.decode_float(self._state, data, len(data), frame_size, decode_fec, channels=self._channels)

    # CTL interfaces

    _get_final_range = lambda self: decoder.ctl(self._state, ctl.get_final_range)

    final_range = property(_get_final_range)

    _get_bandwidth = lambda self: decoder.ctl(self._state, ctl.get_bandwidth)

    bandwidth = property(_get_bandwidth)

    _get_pitch = lambda self: decoder.ctl(self._state, ctl.get_pitch)

    pitch = property(_get_pitch)

    _get_lsb_depth = lambda self: decoder.ctl(self._state, ctl.get_lsb_depth)

    _set_lsb_depth = lambda self, x: decoder.ctl(self._state, ctl.set_lsb_depth, x)

    lsb_depth = property(_get_lsb_depth, _set_lsb_depth)

    _get_gain = lambda self: decoder.ctl(self._state, ctl.get_gain)

    _set_gain = lambda self, x: decoder.ctl(self._state, ctl.set_gain, x)

    gain = property(_get_gain, _set_gain)
