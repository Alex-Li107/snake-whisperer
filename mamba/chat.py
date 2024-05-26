"""
Code borrowed from https://github.com/redotvideo/mamba-chat for interacting with mamba
"""
from backend.snake_whisperer.settings import get_mamba_model
from typing import Dict, List


def chat(messages: List[Dict[str, str]], user_message: str) -> str:
    """
    Predicts a response given the current and past messages

    :param messages: past messages
    :param user_message: current messages
    :return: what mamba thinks the response should be
    """
    mamba_model, tokenizer = get_mamba_model()

    input_ids = tokenizer.apply_chat_template(messages, return_tensors="pt", add_generation_prompt=True).to("cuda")

    out = mamba_model.generate(input_ids=input_ids, max_length=2000, temperature=0.9, top_p=0.7,
                               eos_token_id=tokenizer.eos_token_id)

    decoded = tokenizer.batch_decode(out)

    mamba_output = decoded[0].split("<|assistant|>\n")[-1]

    return mamba_output
