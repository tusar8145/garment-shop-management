from fastapi import FastAPI
import numpy as np
import pandas as pd
import sklearn
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
import requests
import json2csv
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import csr_matrix
import json
from fastapi.middleware.cors import CORSMiddleware

warnings.simplefilter(action='ignore', category=FutureWarning)

app = FastAPI()
 
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}
    
@app.get("/recommendation/{user_id}")
async def read_root(user_id: int):

    base_url='http://localhost:8000/api/public/'

    ratings_get = pd.DataFrame(requests.get(base_url+'rating?take=&&skip=').json())
    csv_file = 'ratings.csv'
    ratings_get.to_csv(csv_file, index=False)
      
    #loading rating dataset
    ratings = pd.read_csv("ratings.csv")
     
    garments_get = pd.DataFrame(requests.get(base_url+'rating-garment?take=&&skip=').json())
    csv_file = 'garments.csv'
    garments_get.to_csv(csv_file, index=False)

    # loading garment dataset
    garments = pd.read_csv("garments.csv")


    n_ratings = len(ratings)
    n_garments = len(ratings['garment_id'].unique())
    n_users = len(ratings['customer_id'].unique())

    print(f"Number of ratings: {n_ratings}")
    print(f"Number of unique garment_id's: {n_garments}")
    print(f"Number of unique users: {n_users}")
    print(f"Average ratings per user: {round(n_ratings/n_users, 2)}")
    print(f"Average ratings per garment: {round(n_ratings/n_garments, 2)}")


    user_freq = ratings[['customer_id', 'garment_id']].groupby(
        'customer_id').count().reset_index()
    user_freq.columns = ['customer_id', 'n_ratings']
    print(user_freq.head())


    # Find Lowest and Highest rated garments:
    mean_rating = ratings.groupby('garment_id')[['rating']].mean()
    # Lowest rated garments
    lowest_rated = mean_rating['rating'].idxmin()
    garments.loc[garments['id'] == lowest_rated]
    # Highest rated garments
    highest_rated = mean_rating['rating'].idxmax()
    garments.loc[garments['id'] == highest_rated]
    # show number of people who rated garments rated garment highest
    ratings[ratings['garment_id']==highest_rated]
    # show number of people who rated garments rated garment lowest
    ratings[ratings['garment_id']==lowest_rated]

    ## the above garments has very low dataset. We will use bayesian average
    garment_stats = ratings.groupby('garment_id')[['rating']].agg(['count', 'mean'])
    garment_stats.columns = garment_stats.columns.droplevel()

    def create_matrix(df):
        
        N = len(df['customer_id'].unique())
        M = len(df['garment_id'].unique())
        
        # Map Ids to indices
        user_mapper = dict(zip(np.unique(df["customer_id"]), list(range(N))))
        garment_mapper = dict(zip(np.unique(df["garment_id"]), list(range(M))))
        
        # Map indices to IDs
        user_inv_mapper = dict(zip(list(range(N)), np.unique(df["customer_id"])))
        garment_inv_mapper = dict(zip(list(range(M)), np.unique(df["garment_id"])))
        
        user_index = [user_mapper[i] for i in df['customer_id']]
        garment_index = [garment_mapper[i] for i in df['garment_id']]

        X = csr_matrix((df["rating"], (garment_index, user_index)), shape=(M, N))
        
        return X, user_mapper, garment_mapper, user_inv_mapper, garment_inv_mapper
        
    X, user_mapper, garment_mapper, user_inv_mapper, garment_inv_mapper = create_matrix(ratings)


    """
    Find similar garments using KNN
    """
    def find_similar_garments(garment_id, X, k, metric='cosine', show_distance=False):
        
        neighbour_ids = []
        
        garment_ind = garment_mapper[garment_id]
        garment_vec = X[garment_ind]
        k+=1
        kNN = NearestNeighbors(n_neighbors=k, algorithm="brute", metric=metric)
        kNN.fit(X)
        garment_vec = garment_vec.reshape(1,-1)
        neighbour = kNN.kneighbors(garment_vec, return_distance=show_distance)
        for i in range(0,k):
            n = neighbour.item(i)
            neighbour_ids.append(garment_inv_mapper[n])
        neighbour_ids.pop(0)
        return neighbour_ids


    # garment_titles = dict(zip(garments['id'], garments['name']))

    # garment_id = 3

    # similar_ids = find_similar_garments(garment_id, X, k=10)
    # garment_title = garment_titles[garment_id]

    # print(f"Since you watched {garment_title}")
    # for i in similar_ids:
    #	print(garment_titles[i])


    def recommend_garments_for_user(user_id, X, user_mapper, garment_mapper, garment_inv_mapper, k=10):
        df1 = ratings[ratings['customer_id'] == user_id]
        
        if df1.empty:
            print(f"User with ID {user_id} does not exist.")
            return

        garment_id = df1[df1['rating'] == max(df1['rating'])]['garment_id'].iloc[0]

        garment_titles = dict(zip(garments['id'], garments['name']))

        similar_ids = find_similar_garments(garment_id, X, k)
        garment_title = garment_titles.get(garment_id, "Garment not found")

        if garment_title == "Garment not found":
            print(f"Garment with ID {garment_id} not found.")
            
        str1 = "["
        #print(f"Since you watched {garment_title}, you might also like:")
        for i in similar_ids:
            str1  = str1+'{"id":'+str(i)+', "name":"'+garment_titles.get(i, "Garment not found")+'"},'
        
        Str = str1
        a = ""
        for i in range(len(Str)-1):
            a += Str[i]
    
        return a+']'
        #    print(garment_titles.get(i, "Garment not found"))

    user_id = user_id # Replace with the desired user ID
    return recommend_garments_for_user(user_id, X, user_mapper, garment_mapper, garment_inv_mapper, k=10)
