"""
File of utility functions
"""
import json
from typing import Union


def read_json_key(file_path: str, key: str) -> Union[str, None]:
    """
    Returns the value given a key in a json file

    :param file_path: path to json file
    :param key: key to search for
    :return: hte key or None
    """
    with open(file_path, 'r') as file:
        data = json.load(file)

    if key in data:
        return data[key]
    else:
        return None