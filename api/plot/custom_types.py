from dataclasses import dataclass
from py_ts_interfaces import Interface
from typing import Any, List

from enum import IntEnum


class MsgType(IntEnum):
    status = 0
    new_line_request = 1
    aux_line_data = 2


@dataclass(unsafe_hash=True)
class PlotMessage(Interface):
    '''Class for messages.'''
    type: int
    params: Any

    def __init__(self, type, params):
        if isinstance(type, str):
            self.type = MsgType[type]
        elif isinstance(type, int):
            self.type = MsgType(type)
        self.params: Any = params


class StatusType(IntEnum):
    ready = 1
    busy = 2


@dataclass(unsafe_hash=True)
class NewLineParams(Interface):
    '''Class for requesting new line data.'''
    line_id: str


@dataclass(unsafe_hash=True)
class LineData(Interface):
    '''Class for representing a line.'''
    id: str
    colour: str
    x: List[float]
    y: List[float]


@dataclass(unsafe_hash=True)
class LineDataMessage(Interface):
    '''Class for representing a line message.'''
    type: str
    data: LineData


@dataclass(unsafe_hash=True)
class MultiDataMessage(Interface):
    '''Class for representing a multiline message.'''
    type: str
    data: List[LineData]
