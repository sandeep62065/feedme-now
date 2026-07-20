# 🎓 Feedme-Now: Viva Preparation & Project Guide

यह डॉक्यूमेंट आपको आपके कॉलेज/इंटर्नशिप के फाइनल वाइवा (Viva) और प्रेजेंटेशन के लिए तैयार करने के लिए बनाया गया है। इसमें आपके प्रोजेक्ट का पूरा आर्किटेक्चर (Architecture), किस फाइल में क्या लिखा है, और एग्जामिनर (Examiner) द्वारा पूछे जा सकने वाले संभावित सवालों के जवाब दिए गए हैं।

---

## 🏗️ 1. Project Architecture (प्रोजेक्ट कैसे काम करता है?)

आपका प्रोजेक्ट **MERN Stack** (MongoDB, Express, React, Node.js) पर बना है।

* **Frontend (Client):** **React.js** (Vite के साथ) और **Tailwind CSS** इस्तेमाल किया गया है। यह यूजर को UI दिखाता है।
* **Backend (Server):** **Node.js** और **Express.js** का इस्तेमाल करके REST API बनाई गई है जो Frontend से रिक्वेस्ट लेती है।
* **Database:** **MongoDB Atlas** (Cloud Database) का इस्तेमाल किया गया है जहाँ सारा डेटा (Users, Orders, Menu Items) सेव होता है। डेटाबेस से कनेक्ट करने के लिए **Mongoose** लाइब्रेरी इस्तेमाल हुई है।

### 🔑 3-Role System (आपके प्रोजेक्ट की सबसे बड़ी खासियत)
आपके प्रोजेक्ट में तीन अलग-अलग तरह के यूजर्स हैं:
1. **Customer (ग्राहक):** जो वेबसाइट पर आकर खाना कार्ट (Cart) में डालता है और ऑर्डर प्लेस करता है।
2. **Admin (मालिक):** जो रेस्टोरेंट का मेन्यू अपडेट करता है, नए आइटम्स डालता है और ऑर्डर्स की समरी (Summary) देखता है।
3. **Delivery Partner (डिलीवरी बॉय):** जिसके लिए एक अलग डैशबोर्ड (`/delivery-dashboard`) है। वह वहाँ से ऑर्डर 'Accept' करता है और कस्टमर के घर तक पहुँचाता है।

---

## ⚙️ 2. Key Features & Code Explanation (कौन सा फीचर कैसे बना है?)

वाइवा में अक्सर पूछा जाता है: *"यह फीचर कैसे काम कर रहा है और इसका कोड कहाँ है?"*

### A. Real-Time Order & Location Tracking (Socket.io)
**फीचर:** जब डिलीवरी बॉय अपना लोकेशन अपडेट करता है, तो कस्टमर को मैप (Map) पर वह लाइव चलता हुआ दिखाई देता है।
* **कैसे काम करता है?** इसके लिए **Socket.io** का इस्तेमाल हुआ है। यह Client (Frontend) और Server (Backend) के बीच एक 2-way कनेक्शन बना देता है। जब डिलीवरी बॉय का फ़ोन `updateDeliveryLocation` इवेंट भेजता है, तो सर्वर उसे तुरंत उस कस्टमर की स्क्रीन (Room) पर `deliveryLocationUpdate` नाम से भेज देता है।
* **कोड कहाँ है?** 
  * Backend: `backend/server.js` में `io.on('connection')` वाला हिस्सा।
  * Frontend: `frontend/src/pages/OrderHistoryPage.jsx` में जहाँ मैप दिखता है।

### B. Map & GPS Tracking (Leaflet & Geolocation API)
**फीचर:** यूजर अपना एड्रेस खुद से ढूँढ सकता है और डिलीवरी बॉय का लाइव मैप देख सकता है।
* **कैसे काम करता है?** हमने Google Maps की जगह **Leaflet.js** (OpenStreetMap) इस्तेमाल किया है (ताकि कोई API Bill न आए)। यूजर का करंट लोकेशन ब्राउज़र की इनबिल्ट **HTML5 Geolocation API** (`navigator.geolocation.getCurrentPosition`) से लिया जाता है।

### C. Security & Authentication (JWT - JSON Web Tokens)
**फीचर:** लॉगिन, साइनअप और एडमिन सिक्योरिटी।
* **कैसे काम करता है?** जब यूजर लॉगिन करता है, तो बैकएंड उसे 2 टोकन (Tokens) देता है:
  1. **Access Token (15 mins):** यह शॉर्ट-टर्म टोकन है जो Frontend के मेमोरी में रहता है।
  2. **Refresh Token (7 days):** यह एक `HTTP-Only Cookie` में सेव होता है। (HTTP-Only का मतलब है कि कोई भी हैकर JavaScript का इस्तेमाल करके इसे चुरा नहीं सकता)। जब Access Token एक्सपायर होता है, तो `api.js` (Axios Interceptor) चुपचाप बैकएंड से नया टोकन ले आता है जिससे यूजर बार-बार लॉगआउट नहीं होता।
* **कोड कहाँ है?** `backend/controllers/authController.js` और `frontend/src/services/api.js`।

### D. Cart Management (Local Storage)
**फीचर:** पेज रिफ्रेश करने पर भी कार्ट से आइटम नहीं हटते।
* **कैसे काम करता है?** कार्ट का सारा डेटा ब्राउज़र के `localStorage` में सेव किया गया है। जब यूजर ऑर्डर प्लेस करता है (`/api/orders` पर POST रिक्वेस्ट), तो बैकएंड **फ्रंटएंड के प्राइसेस पर भरोसा नहीं करता**, बल्कि डेटाबेस से असली प्राइस चेक करके टोटल बिल बनाता है। (यह सुरक्षा के लिए बहुत ज़रूरी है)।

---

## ❓ 3. Top Viva Questions & Answers

**Q1. आपने MERN Stack ही क्यों चुना?**
*Answer:* क्योंकि MERN Stack में पूरा प्रोजेक्ट JavaScript में लिखा जाता है (Frontend और Backend दोनों)। इससे डेवलपमेंट तेज़ होता है। React से UI बहुत फ़ास्ट (Single Page Application) बनता है, और MongoDB JSON फॉर्मेट में डेटा सेव करता है जो Node.js के साथ परफेक्ट मैच है।

**Q2. Socket.io और साधारण HTTP (AJAX/Fetch) रिक्वेस्ट में क्या फर्क है?**
*Answer:* साधारण HTTP रिक्वेस्ट 1-way होती है (क्लाइंट माँगता है, सर्वर देता है)। अगर डिलीवरी बॉय का लोकेशन जानना है तो साधारण HTTP में क्लाइंट को हर 2 सेकंड में रिक्वेस्ट (Polling) भेजनी पड़ेगी जिससे सर्वर क्रैश हो सकता है। Socket.io (WebSockets) 2-way कनेक्शन है। सर्वर अपनी मर्ज़ी से डेटा क्लाइंट को पुश कर सकता है। इससे रियल-टाइम ट्रैकिंग बहुत फ़ास्ट और सर्वर-फ्रेंडली हो जाती है।

**Q3. अगर कोई चालाक कस्टमर ब्राउज़र (Inspect Element) से 'Pizza' का प्राइस 249 रुपये से 1 रुपया कर दे, तो क्या होगा?**
*Answer:* वह ऐसा कर सकता है और कार्ट में 1 रुपया दिखेगा भी। लेकिन जब वह "Place Order" पर क्लिक करेगा, तो मेरा Frontend सिर्फ `menuItemId` बैकएंड को भेजता है। बैकएंड (Backend) डेटाबेस से उस `menuItemId` का असली प्राइस (249 रु.) निकालता है और उसी प्राइस से बिल बनाता है। इसलिए हैकिंग संभव नहीं है।

**Q4. आपने 'Refresh Token' का इस्तेमाल क्यों किया? सिर्फ एक 'Access Token' काफी नहीं था?**
*Answer:* अगर मैं एक Access Token देता और उसकी एक्सपायरी 10 दिन रखता, और वो टोकन चोरी हो जाता, तो हैकर 10 दिन तक अकाउंट इस्तेमाल कर सकता है। इसलिए मैंने Access Token सिर्फ 15 मिनट का रखा। अगर वो चोरी भी हो जाए तो 15 मिनट में बेकार हो जाएगा। नया टोकन पाने के लिए Refresh Token चाहिए जो `http-only cookie` में सुरक्षित रहता है और जिसे JavaScript रीड नहीं कर सकती। यह बहुत हाई सिक्योरिटी स्टैंडर्ड है।

**Q5. आपने Vercel पर डिप्लॉयमेंट कैसे किया?**
*Answer:* Vercel Serverless Architecture पर काम करता है। Frontend (Vite/React) को मैंने सीधे Vercel से जोड़ा। Backend (Express) के लिए मुझे `vercel.json` फाइल बनानी पड़ी जो Vercel को बताती है कि सारी API रिक्वेस्ट्स `server.js` पर भेजनी हैं।

---

## 📂 4. Project Folder Structure Summary

* `backend/server.js`: प्रोजेक्ट का दिल। यहाँ से सर्वर चालू होता है और Database, Socket, CORS सेट होते हैं।
* `backend/models/`: यहाँ MongoDB का स्कीमा (Schema) डिज़ाइन है (जैसे User में क्या डिटेल्स होंगी, Order में क्या होगा)।
* `frontend/src/App.jsx`: सारे Routes (URL) यहाँ लिखे हैं कि किस लिंक पर कौन सा पेज खुलेगा।
* `frontend/src/context/`: `AuthContext` और `CartContext` ग्लोबल स्टेट मैनेजमेंट के लिए हैं ताकि लॉगिन डिटेल्स और कार्ट पूरे ऐप में कहीं से भी एक्सेस हो सके।

---
**Good Luck for your Viva! 🚀 You have built an amazing, professional-grade project.**
