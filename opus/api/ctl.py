"""CTL macros rewritten to Python

Usage example:

    from opus.api import decoder, ctl

    dec = decoder.create(48000, 2)
    decoder.ctl(dec, ctl.set_gain, -15)
    gain_value = decoder.ctl(dec, ctl.get_gain)

"""

import ctypes

from opus.api import constants
from opus.exceptions import OpusError


def query(request):
    """Query encoder/decoder with a request value"""

    def inner(func, obj):
        result_code = func(obj, request)

        if result_code is not constants.OK:
            raise OpusError(result_code)

        return result_code

    return inner


def get(request, result_type):
    """Get CTL value from a encoder/decoder"""

    def inner(func, obj):
        result = result_type()
        result_code = func(obj, request, ctypes.byref(result))

        if result_code is not constants.OK:
            raise OpusError(result_code)

        return result.value

    return inner


def set(request):
    """Set new CTL value to a encoder/decoder"""

    def inner(func, obj, value):
        result_code = func(obj, request, value)
        if result_code is not constants.OK:
            raise OpusError(result_code)

    return inner

#
# Generic CTLs
#

# Resets the codec state to be equivalent to a freshly initialized state
reset_state = query(constants.RESET_STATE)

# Gets the final state of the codec's entropy coder
get_final_range = get(constants.GET_FINAL_RANGE_REQUEST, ctypes.c_uint)

# Gets the encoder's configured bandpass or the decoder's last bandpass
get_bandwidth = get(constants.GET_BANDWIDTH_REQUEST, ctypes.c_int)

# Gets the pitch of the last decoded frame, if available
get_pitch = get(constants.GET_PITCH_REQUEST, ctypes.c_int)

# Configures the depth of signal being encoded
set_lsb_depth = set(constants.SET_LSB_DEPTH_REQUEST)

# Gets the encoder's configured signal depth
get_lsb_depth = get(constants.GET_LSB_DEPTH_REQUEST, ctypes.c_int)

#
# Decoder related CTLs
#

# Gets the decoder's configured gain adjustment
get_gain = get(constants.GET_GAIN_REQUEST, ctypes.c_int)

# Configures decoder gain adjustment
set_gain = set(constants.SET_GAIN_REQUEST)

#
# Encoder related CTLs
#

# Configures the encoder's computational complexity
set_complexity = set(constants.SET_COMPLEXITY_REQUEST)

# Gets the encoder's complexity configuration
get_complexity = get(constants.GET_COMPLEXITY_REQUEST, ctypes.c_int)

# Configures the bitrate in the encoder
set_bitrate = set(constants.SET_BITRATE_REQUEST)

# Gets the encoder's bitrate configuration
get_bitrate = get(constants.GET_BITRATE_REQUEST, ctypes.c_int)

# Enables or disables variable bitrate (VBR) in the encoder
set_vbr = set(constants.SET_VBR_REQUEST)

# Determine if variable bitrate (VBR) is enabled in the encoder
get_vbr = get(constants.GET_VBR_REQUEST, ctypes.c_int)

# Enables or disables constrained VBR in the encoder
set_vbr_constraint = set(constants.SET_VBR_CONSTRAINT_REQUEST)

# Determine if constrained VBR is enabled in the encoder
get_vbr_constraint = get(constants.GET_VBR_CONSTRAINT_REQUEST, ctypes.c_int)

# Configures mono/stereo forcing in the encoder
set_force_channels = set(constants.SET_FORCE_CHANNELS_REQUEST)

# Gets the encoder's forced channel configuration
get_force_channels = get(constants.GET_FORCE_CHANNELS_REQUEST, ctypes.c_int)

# Configures the maximum bandpass that the encoder will select automatically
set_max_bandwidth = set(constants.SET_MAX_BANDWIDTH_REQUEST)

# Gets the encoder's configured maximum allowed bandpass
get_max_bandwidth = get(constants.GET_MAX_BANDWIDTH_REQUEST, ctypes.c_int)

# Sets the encoder's bandpass to a specific value
set_bandwidth = set(constants.SET_BANDWIDTH_REQUEST)

# Configures the type of signal being encoded
set_signal = set(constants.SET_SIGNAL_REQUEST)

# Gets the encoder's configured signal type
get_signal = get(constants.GET_SIGNAL_REQUEST, ctypes.c_int)

# Configures the encoder's intended application
set_application = set(constants.SET_APPLICATION_REQUEST)

# Gets the encoder's configured application
get_application = get(constants.GET_APPLICATION_REQUEST, ctypes.c_int)

# Gets the sampling rate the encoder or decoder was initialized with
get_sample_rate = get(constants.GET_SAMPLE_RATE_REQUEST, ctypes.c_int)

# Gets the total samples of delay added by the entire codec
get_lookahead = get(constants.GET_LOOKAHEAD_REQUEST, ctypes.c_int)

# Configures the encoder's use of inband forward error correction (FEC)
set_inband_fec = set(constants.SET_INBAND_FEC_REQUEST)

# Gets encoder's configured use of inband forward error correction
get_inband_fec = get(constants.GET_INBAND_FEC_REQUEST, ctypes.c_int)

# Configures the encoder's expected packet loss percentage
set_packet_loss_perc = set(constants.SET_PACKET_LOSS_PERC_REQUEST)

# Gets the encoder's configured packet loss percentage
get_packet_loss_perc = get(constants.GET_PACKET_LOSS_PERC_REQUEST, ctypes.c_int)

# Configures the encoder's use of discontinuous transmission (DTX)
set_dtx = set(constants.SET_DTX_REQUEST)

# Gets encoder's configured use of discontinuous transmission
get_dtx = get(constants.GET_DTX_REQUEST, ctypes.c_int)

#
# Other stuff
#

unimplemented = query(constants.UNIMPLEMENTED)
