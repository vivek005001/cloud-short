from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import re

app = FastAPI(title="ML Analytics Service")

# Request models
class TrendRequest(BaseModel):
    clicks: list[int]  # e.g., [5, 12, 7, 9, 10]

class URLCheckRequest(BaseModel):
    url: str

# Trend prediction endpoint
@app.post("/predict_trend")
def predict_trend(req: TrendRequest):
    clicks = np.array(req.clicks)
    X = np.arange(len(clicks)).reshape(-1, 1)
    y = clicks
    model = LinearRegression()
    model.fit(X, y)
    next_day_pred = int(model.predict([[len(clicks)]])[0])
    return {"predicted_next_clicks": max(0, next_day_pred)}

# Simple URL suspicious check
@app.post("/check_url")
def check_url(req: URLCheckRequest):
    url = req.url.lower()
    score = 0
    if len(url) > 75: score += 1
    if re.search(r"[@!$%^*()_+=]", url): score += 1
    if re.search(r"bit\.ly|tinyurl|goo\.gl|0x[a-f0-9]{4,}", url):
        score += 1
    return {"url": url, "suspicious_score": score, "is_suspicious": score >= 2}
