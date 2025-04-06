import json
import pandas as pd

def convert_json_to_csv(json_file, csv_file):
    """Convert JSON file to CSV format"""
    with open(json_file, "r") as file:
        data = json.load(file)
    
    df = pd.DataFrame(data)
    df.to_csv(csv_file, index=False)
    print(f"Converted {json_file} to {csv_file}")

# Example usage
convert_json_to_csv("tweets.json", "tweets.csv")
