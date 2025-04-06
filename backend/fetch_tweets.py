# import requests
# import json
# import pandas as pd

# # Twitter API v2 credentials
# BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAFQyzgEAAAAA3hATtGATVcX5DP2WxTXGWWOp7Ns%3DzVW8r2r8qQBcgj2TMJQyVsfo1uIoVwvOnCPgmlekJSa1RnXD3p"
# def create_headers():
#     """Create headers for API request"""
#     headers = {"Authorization": f"Bearer {BEARER_TOKEN}"}
#     return headers

# def fetch_recent_tweets(count=50):
#     """Fetch recent public tweets (without a specific keyword)"""
#     query = "the OR news OR trending OR update"  # Using a common word to get general tweets
#     url = f"https://api.twitter.com/2/tweets/search/recent?max_results={count}&tweet.fields=created_at,public_metrics,author_id"
#     headers = create_headers()
    
#     response = requests.get(url, headers=headers)
    
#     if response.status_code != 200:
#         print("Error:", response.status_code, response.json())
#         return None
    
#     tweets = response.json().get("data", [])
    
#     tweets_data = []
#     for tweet in tweets:
#         tweets_data.append({
#             "tweet_id": tweet["id"],
#             "created_at": tweet["created_at"],
#             "text": tweet["text"],
#             "likes": tweet["public_metrics"]["like_count"],
#             "retweets": tweet["public_metrics"]["retweet_count"],
#             "author_id": tweet["author_id"]
#         })
    
#     with open("tweets.json", "w") as file:
#         json.dump(tweets_data, file, indent=4)

#     return pd.DataFrame(tweets_data)

# # Example usage:
# df = fetch_recent_tweets(50)
# print()























# import requests
# import json
# import pandas as pd

# # Twitter API v2 credentials
# BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAFQyzgEAAAAA5CG%2FPcaa7vaQ1yCBuxzxW8QxhSs%3DRWMce4w0wzTvhHg9paND0DxbyMVQsC7av8F6fmyT5gsF74fvhK"

# def create_headers():
#     """Create headers for API request"""
#     headers = {"Authorization": f"Bearer {BEARER_TOKEN}"}
#     return headers

# def fetch_recent_tweets(count=50):
#     """Fetch recent public tweets with a broad query"""
#     query = "news OR trending OR update OR technology OR sports" # Make sure it's not empty
#     url = f"https://api.twitter.com/2/tweets/search/recent?query={query}&max_results={count}&tweet.fields=created_at,public_metrics,author_id"
    
#     headers = create_headers()
#     response = requests.get(url, headers=headers)
    
#     if response.status_code != 200:
#         print("Error:", response.status_code, response.json())
#         return None
    
#     tweets = response.json().get("data", [])
    
#     tweets_data = []
#     for tweet in tweets:
#         tweets_data.append({
#             "tweet_id": tweet["id"],
#             "created_at": tweet["created_at"],
#             "text": tweet["text"],
#             "likes": tweet["public_metrics"]["like_count"],
#             "retweets": tweet["public_metrics"]["retweet_count"],
#             "author_id": tweet["author_id"]
#         })
    
#     with open("tweets.json", "w") as file:
#         json.dump(tweets_data, file, indent=4)

#     return pd.DataFrame(tweets_data)

# # Example usage:
# df = fetch_recent_tweets(50)
# print(df)























import requests
import json
import pandas as pd

# Twitter API v2 credentials
BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAN4oxgEAAAAAP4yAgjIQ8Jbt9UTiiyvjpeFCQFM%3DKvpx1sntfS4xIIrGNzARMUseLWlulwes7qQSLPA8WqJ1U6udKv"
def create_headers():
    """Create headers for API request"""
    headers = {"Authorization": f"Bearer {BEARER_TOKEN}"}
    return headers

def fetch_recent_tweets(count=50):
    """Fetch recent public tweets with a broad query"""
    query = "news OR trending OR update OR technology OR sports" # Make sure it's not empty
    url = f"https://api.twitter.com/2/tweets/search/recent?query={query}&max_results={count}&tweet.fields=created_at,public_metrics,author_id"
    
    headers = create_headers()
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print("Error:", response.status_code, response.json())
        return None
    
    tweets = response.json().get("data", [])
    
    tweets_data = []
    for tweet in tweets:
        tweets_data.append({
            "tweet_id": tweet["id"],
            "created_at": tweet["created_at"],
            "text": tweet["text"],
            "likes": tweet["public_metrics"]["like_count"],
            "retweets": tweet["public_metrics"]["retweet_count"],
            "author_id": tweet["author_id"]
        })
    
    with open("tweets.json", "w") as file:
        json.dump(tweets_data, file, indent=4)

    return pd.DataFrame(tweets_data)

# Example usage:
df = fetch_recent_tweets(50)
print(df)
