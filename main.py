import numpy as np
import os
import cv2
import random
from matplotlib import pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.model_selection import train_test_split
from sklearn import metrics
from collections import Counter
from imblearn.over_sampling import RandomOverSampler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Activation, Flatten, Conv2D, MaxPooling2D

# Dataset setup
DATADIR = "data"
CATEGORIES = os.listdir(DATADIR)
IMG_SIZE = 100

# Load and preprocess images
training_data = []

def create_training_data():
    for category in CATEGORIES:
        path = os.path.join(DATADIR, category)
        class_num = CATEGORIES.index(category)
        for img in os.listdir(path):
            try:
                img_array = cv2.imread(os.path.join(path, img), cv2.IMREAD_GRAYSCALE)
                clahe = cv2.createCLAHE(clipLimit=100.0, tileGridSize=(8, 8))
                img_array = clahe.apply(img_array)
                median = cv2.medianBlur(img_array.astype('uint8'), 5)
                median = 255 - median
                _, thresh = cv2.threshold(median.astype('uint8'), 165, 255, cv2.THRESH_BINARY_INV)
                new_array = cv2.resize(thresh, (IMG_SIZE, IMG_SIZE))
                training_data.append([new_array, class_num])
            except Exception:
                pass

create_training_data()
random.shuffle(training_data)

# Separate features and labels
X, y = [], []
for features, label in training_data:
    X.append(features)
    y.append(label)

X = np.array(X).reshape(-1, IMG_SIZE, IMG_SIZE, 1) / 255.0
y = np.array(y)

# Balance classes
X_flat = X.reshape((X.shape[0], -1))
ros = RandomOverSampler(random_state=42)
X_balanced, y_balanced = ros.fit_resample(X_flat, y)
print("Balanced class distribution:", Counter(y_balanced))
X_balanced = X_balanced.reshape((-1, IMG_SIZE, IMG_SIZE, 1))

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X_balanced, y_balanced, test_size=0.2, random_state=40)

# Build CNN model
model = Sequential()

model.add(Conv2D(32, (3, 3), activation="relu", input_shape=(IMG_SIZE, IMG_SIZE, 1)))
model.add(MaxPooling2D(pool_size=(2, 2)))

model.add(Conv2D(64, (3, 3), activation="relu"))
model.add(MaxPooling2D(pool_size=(2, 2)))

model.add(Conv2D(64, (3, 3), activation="relu"))
model.add(MaxPooling2D(pool_size=(2, 2)))

model.add(Dropout(0.25))
model.add(Flatten())

model.add(Dense(128, activation="relu"))
model.add(Dense(128, activation="relu"))

model.add(Dense(len(CATEGORIES), activation="softmax"))

model.compile(loss="sparse_categorical_crossentropy", optimizer="adam", metrics=["accuracy"])

# Train model
history = model.fit(X_train, y_train, batch_size=32, epochs=10, validation_split=0.2)

# Save model
model.save('CNN.h5')
print("Saved model to disk")

# Plot accuracy and loss
acc = history.history['accuracy']
val_acc = history.history['val_accuracy']
loss = history.history['loss']
val_loss = history.history['val_loss']

plt.figure(figsize=(12, 6))
plt.subplot(1, 2, 1)
plt.plot(acc, label='Train Accuracy')
plt.plot(val_acc, label='Val Accuracy')
plt.legend()
plt.title('Accuracy')

plt.subplot(1, 2, 2)
plt.plot(loss, label='Train Loss')
plt.plot(val_loss, label='Val Loss')
plt.legend()
plt.title('Loss')
plt.show()

# Evaluate on test data
_, test_acc = model.evaluate(X_test, y_test)
print(f'Test accuracy: {test_acc:.4f}')

# Predictions
y_pred = model.predict(X_test)
yt = np.argmax(y_pred, axis=1)

print("Accuracy:", metrics.accuracy_score(yt, y_test) * 100)
print("\nClassification Report:\n", classification_report(y_test, yt))

# Confusion Matrix
conf_matrix = confusion_matrix(y_test, yt)
plt.figure(figsize=(8, 6))
sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues', xticklabels=CATEGORIES, yticklabels=CATEGORIES)
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix')
plt.show()
