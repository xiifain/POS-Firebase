import * as express from "express";
import * as admin from "firebase-admin";

enum HTTP {
    OK = 200,
    ERROR = 404,
    FORBIDDEN = 503
}



export const app = express();
app.use(express.json());

/* -------- HOME ROUTE ----------*/
app.get("/", (_,response) => {
  response.sendStatus(HTTP.OK);
});

app.get("/products", async (_, response) => {

    try {
      const snapshot = await admin.firestore().collection("Products").get();

      var something: FirebaseFirestore.DocumentData[] = [];
  
      if (snapshot.empty) {
        console.log("No Matching Documents.");
        response.json(something);
        return;
      }
  
      snapshot.forEach((doc) => {
        something.push(doc.data());
      });
      response.json(something);
    } catch (error) {
      console.log(error);
      response.sendStatus(503);
    }
});

app.get("/:productName", async (request , response) => {

  try {
    const { productName } = request.params;

    const doc = await admin
      .firestore()
      .collection("Products")
      .doc(productName)
      .get();

    if (!doc.exists) {
      console.log("No matching documents.");
      response.sendStatus(404);
      return;
    }

    else {
      response.json(doc.data());
    }

  } catch (error) {
    console.log(error);
    response.sendStatus(503);
  }
});


app.post("/product", async (request, response) => {

  await admin.firestore().collection("Products").doc(request.body.sku).set(request.body);
  response.sendStatus(200);
});