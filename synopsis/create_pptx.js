const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const LOGO_PATH = path.join(__dirname, "image1.png");
const LOGO_DATA = "image/png;base64," + fs.readFileSync(LOGO_PATH).toString("base64");

const C = {
  bg: "FFFFFF", text: "000000", textSoft: "333333", textMuted: "666666",
  line: "000000", lineSoft: "AAAAAA", headerGray: "E0E0E0",
};

const F = "Times New Roman";
const SW = 10, SH = 7.5;

function addFooter(slide, num) {
  slide.addShape("line", { x: 0.8, y: 6.95, w: 8.4, h: 0, line: { color: C.lineSoft, width: 0.5 } });
  slide.addText("Yashika, Pushpa, Atharv", { x: 0.8, y: 7.0, w: 3, h: 0.3, fontSize: 8, fontFace: F, color: C.textMuted, margin: 0 });
  slide.addText("Food Calorie Estimation \u2014 Synopsis", { x: 3.3, y: 7.0, w: 3.4, h: 0.3, fontSize: 8, fontFace: F, color: C.textMuted, align: "center", margin: 0 });
  slide.addText(`${num}`, { x: 8.3, y: 7.0, w: 0.9, h: 0.3, fontSize: 8, fontFace: F, color: C.textMuted, align: "right", margin: 0 });
}

function slideHead(slide, sectionTitle) {
  slide.background = { color: C.bg };
  slide.addImage({ data: LOGO_DATA, x: 0.5, y: 0.12, w: 0.65, h: 0.72 });
  slide.addText([
    { text: "Department of Engineering & Technology", options: { fontSize: 10.5, bold: true, breakLine: true } },
    { text: "Gurugram University, Gurugram", options: { fontSize: 10.5 } },
  ], { x: 5.0, y: 0.2, w: 4.2, h: 0.5, fontFace: F, color: C.text, align: "right", margin: 0 });
  slide.addShape("line", { x: 0.5, y: 0.95, w: 9.0, h: 0, line: { color: C.line, width: 1.25 } });
  slide.addText(sectionTitle, {
    x: 0.5, y: 1.12, w: 9.0, h: 0.5,
    fontSize: 22, fontFace: F, bold: true, color: C.text, margin: 0,
  });
  slide.addShape("line", { x: 0.5, y: 1.65, w: 2.8, h: 0, line: { color: C.line, width: 0.75 } });
}

async function createPresentation() {
  let pres = new pptxgen();
  pres.layout = "LAYOUT_4x3";
  pres.author = "Yashika, Pushpa, Atharv";
  pres.title = "Food Calorie Estimation from Photographs Using Deep Learning";


  // ════════════════════════════════════════
  // SLIDE 1 — TITLE PAGE
  // ════════════════════════════════════════
  let s1 = pres.addSlide();
  s1.background = { color: C.bg };

  s1.addImage({ data: LOGO_DATA, x: 0.5, y: 0.2, w: 0.85, h: 0.94 });
  s1.addText([
    { text: "Department of Engineering & Technology", options: { fontSize: 13, bold: true, breakLine: true } },
    { text: "Gurugram University, Gurugram", options: { fontSize: 13 } },
  ], { x: 4.5, y: 0.3, w: 5.0, h: 0.65, fontFace: F, color: C.text, align: "right", margin: 0 });

  s1.addText("Synopsis", {
    x: 0.5, y: 1.8, w: 9.0, h: 0.75,
    fontSize: 38, fontFace: F, color: C.text, align: "center", valign: "bottom", margin: 0,
  });
  s1.addText("on", {
    x: 0.5, y: 2.55, w: 9.0, h: 0.4,
    fontSize: 22, fontFace: F, italic: true, color: C.textMuted, align: "center", valign: "top", margin: 0,
  });
  s1.addText("Food Calorie Estimation from\nPhotographs Using Deep Learning", {
    x: 0.5, y: 3.0, w: 9.0, h: 0.9,
    fontSize: 28, fontFace: F, bold: true, color: C.text, align: "center", valign: "middle", margin: 0,
  });
  s1.addText("EfficientNetV2 + Nutrition Mapping", {
    x: 0.5, y: 3.95, w: 9.0, h: 0.35,
    fontSize: 14, fontFace: F, italic: true, color: C.textSoft, align: "center", margin: 0,
  });

  // Guide
  s1.addText([
    { text: "Under the guidance of", options: { fontSize: 11, italic: true, color: C.textMuted, breakLine: true } },
    { text: "Dr. Anu Yadav", options: { fontSize: 14, bold: true, color: C.text } },
  ], { x: 0.5, y: 4.8, w: 4.2, h: 0.75, fontFace: F, margin: 0, paraSpaceAfter: 2 });

  // Students
  s1.addText([
    { text: "Yashika", options: { fontSize: 14, bold: true } },
    { text: "   (231031150057)", options: { fontSize: 10, color: C.textMuted, breakLine: true } },
    { text: "Pushpa", options: { fontSize: 14, bold: true } },
    { text: "   (231031150040)", options: { fontSize: 10, color: C.textMuted, breakLine: true } },
    { text: "Atharv", options: { fontSize: 14, bold: true } },
    { text: "   (231031150013)", options: { fontSize: 10, color: C.textMuted, breakLine: true } },
    { text: "\n", options: { fontSize: 4, breakLine: true } },
    { text: "B.Tech CSE (IoT) \u2014 6th Semester", options: { fontSize: 11, breakLine: true } },
    { text: "Computer Science & Engineering", options: { fontSize: 11 } },
  ], { x: 4.8, y: 4.4, w: 4.7, h: 2.2, fontFace: F, color: C.text, align: "right", margin: 0, paraSpaceAfter: 1 });

  s1.addShape("line", { x: 0.5, y: 6.85, w: 9.0, h: 0, line: { color: C.lineSoft, width: 0.5 } });
  s1.addText("2025\u201326", { x: 0.5, y: 6.92, w: 2, h: 0.3, fontSize: 9, fontFace: F, color: C.textMuted, margin: 0 });
  s1.addText("Minor Project Synopsis", { x: 3, y: 6.92, w: 4, h: 0.3, fontSize: 9, fontFace: F, color: C.textMuted, align: "center", margin: 0 });
  s1.addText("1", { x: 8.5, y: 6.92, w: 1, h: 0.3, fontSize: 9, fontFace: F, color: C.textMuted, align: "right", margin: 0 });


  // ════════════════════════════════════════
  // SLIDE 2 — INTRODUCTION
  // ════════════════════════════════════════
  let s2 = pres.addSlide();
  slideHead(s2, "Introduction");
  addFooter(s2, 2);

  s2.addText(
    "Dietary monitoring is essential for managing health conditions such as obesity, diabetes, and " +
    "cardiovascular diseases. However, manual calorie tracking is tedious, error-prone, and often " +
    "abandoned by users within weeks [1]. With the ubiquity of smartphone cameras, image-based food " +
    "recognition presents a practical alternative.",
    { x: 0.5, y: 1.9, w: 9.0, h: 0.95, fontSize: 12, fontFace: F, color: C.textSoft, margin: 0, lineSpacingMultiple: 1.4 }
  );

  s2.addText(
    "Recent advances in Convolutional Neural Networks (CNNs), particularly transfer learning with " +
    "architectures such as EfficientNet [2], have demonstrated high accuracy in food image classification. " +
    "This project proposes an end-to-end system that photographs a meal, identifies the food items, " +
    "and estimates their nutritional content using a mapped calorie database.",
    { x: 0.5, y: 3.0, w: 9.0, h: 0.95, fontSize: 12, fontFace: F, color: C.textSoft, margin: 0, lineSpacingMultiple: 1.4 }
  );

  s2.addText("Key Components:", {
    x: 0.5, y: 4.15, w: 9.0, h: 0.3,
    fontSize: 14, fontFace: F, bold: true, color: C.text, margin: 0,
  });

  const components = [
    { head: "Food-101 Dataset", body: " \u2014 101 food categories with 101,000 real-world images [3]" },
    { head: "EfficientNetV2", body: " \u2014 state-of-the-art CNN with compound scaling for accuracy and speed [2]" },
    { head: "Nutrition Database", body: " \u2014 USDA FoodData Central mapping per food class [4]" },
    { head: "Flask Web App", body: " \u2014 upload photo or use camera, get instant calorie breakdown" },
  ];
  let ty = 4.55;
  components.forEach(t => {
    s2.addText([
      { text: "\u2022   " },
      { text: t.head, options: { bold: true } },
      { text: t.body },
    ], { x: 0.8, y: ty, w: 8.7, h: 0.3, fontSize: 12, fontFace: F, color: C.textSoft, margin: 0 });
    ty += 0.38;
  });


  // ════════════════════════════════════════
  // SLIDE 3 — PROBLEM STATEMENT
  // ════════════════════════════════════════
  let s3 = pres.addSlide();
  slideHead(s3, "Problem Statement");
  addFooter(s3, 3);

  s3.addText(
    "Manual calorie estimation requires users to weigh ingredients, look up nutritional tables, and " +
    "perform calculations \u2014 a process most people find impractical for daily use. Studies show that " +
    "self-reported dietary intake is inaccurate by 30\u201350% on average [1].",
    { x: 0.5, y: 1.85, w: 9.0, h: 0.65, fontSize: 11.5, fontFace: F, color: C.textSoft, margin: 0, lineSpacingMultiple: 1.25 }
  );

  s3.addText(
    "An automated vision-based system can reduce this friction by classifying food from a single " +
    "photograph and mapping it to known nutritional values.",
    { x: 0.5, y: 2.55, w: 9.0, h: 0.35, fontSize: 11.5, fontFace: F, color: C.textSoft, margin: 0, lineSpacingMultiple: 1.25 }
  );

  s3.addText("Research Objectives:", {
    x: 0.5, y: 3.0, w: 9.0, h: 0.28,
    fontSize: 13, fontFace: F, bold: true, color: C.text, margin: 0,
  });

  const objectives = [
    "To classify food items from photographs with high accuracy using deep learning [2, 3].",
    "To map recognized food classes to nutritional data (calories, protein, fat, carbs) [4].",
    "To handle visual diversity \u2014 varying lighting, angles, plating styles, and occlusion [5].",
    "To build a practical, user-friendly web interface for real-time estimation.",
  ];
  let cy = 3.35;
  objectives.forEach((c, i) => {
    s3.addText(`${["I.", "II.", "III.", "IV."][i]}     ${c}`, {
      x: 0.8, y: cy, w: 8.7, h: 0.28,
      fontSize: 11.5, fontFace: F, color: C.textSoft, margin: 0,
    });
    cy += 0.34;
  });

  s3.addText("Dataset Summary:", {
    x: 0.5, y: 4.8, w: 9.0, h: 0.28,
    fontSize: 13, fontFace: F, bold: true, color: C.text, margin: 0,
  });

  const dsRows = [
    [
      { text: "Property", options: { bold: true, fill: { color: C.headerGray }, color: C.text } },
      { text: "Value", options: { bold: true, fill: { color: C.headerGray }, color: C.text } },
    ],
    [{ text: "Dataset", options: { color: C.textSoft } }, { text: "Food-101 (ETH Zurich) [3]", options: { color: C.textSoft } }],
    [{ text: "Total Images", options: { color: C.textSoft } }, { text: "101,000 (1,000 per class)", options: { color: C.textSoft } }],
    [{ text: "Classes", options: { color: C.textSoft } }, { text: "101 food categories", options: { color: C.textSoft } }],
    [{ text: "Nutrition Source", options: { color: C.textSoft } }, { text: "USDA FoodData Central [4]", options: { color: C.textSoft } }],
  ];
  s3.addTable(dsRows, {
    x: 0.5, y: 5.12, w: 9.0, colW: [2.5, 6.5],
    fontSize: 10.5, fontFace: F,
    border: { pt: 0.75, color: C.lineSoft },
    rowH: [0.24, 0.22, 0.22, 0.22, 0.22],
    autoPage: false,
  });


  // ════════════════════════════════════════
  // SLIDE 4 — LITERATURE REVIEW
  // ════════════════════════════════════════
  let s4 = pres.addSlide();
  slideHead(s4, "Literature Review");
  addFooter(s4, 4);

  s4.addText(
    "An extensive review of published literature was conducted to understand the state-of-the-art " +
    "in food image recognition and calorie estimation:",
    { x: 0.5, y: 1.9, w: 9.0, h: 0.4, fontSize: 12, fontFace: F, color: C.textSoft, margin: 0, lineSpacingMultiple: 1.35 }
  );

  const litItems = [
    { head: "Food Image Recognition: ", body: "Bossard et al. (2014) introduced the Food-101 dataset and achieved 50.8% accuracy with Random Forests. Deep CNNs have since pushed accuracy beyond 90% [3]." },
    { head: "Transfer Learning: ", body: "Tan & Le (2021) proposed EfficientNetV2 with progressive training, achieving state-of-the-art accuracy on ImageNet while being 5\u201311x faster than prior models [2]." },
    { head: "Calorie Estimation: ", body: "Myers et al. (2015) proposed Im2Calories, combining food recognition with volume estimation using depth data for calorie prediction [6]." },
    { head: "Nutritional Databases: ", body: "The USDA FoodData Central provides comprehensive nutritional profiles for thousands of food items, enabling accurate per-serving calorie mapping [4]." },
    { head: "Mobile Food Recognition: ", body: "Mezgec & Korousic Seljak (2017) demonstrated that deep learning models can achieve practical accuracy for dietary assessment on mobile devices [5]." },
    { head: "Data Augmentation: ", body: "Shorten & Khoshgoftaar (2019) showed that augmentation techniques (rotation, flipping, color jitter) significantly improve CNN generalization on food images [7]." },
  ];

  let ly = 2.45;
  litItems.forEach((item, i) => {
    s4.addText([
      { text: `${i + 1}.  `, options: { bold: true } },
      { text: item.head, options: { bold: true } },
      { text: item.body },
    ], { x: 0.5, y: ly, w: 9.0, h: 0.65, fontSize: 11, fontFace: F, color: C.textSoft, margin: 0, lineSpacingMultiple: 1.25 });
    ly += 0.72;
  });


  // ════════════════════════════════════════
  // SLIDE 5 — OBJECTIVES
  // ════════════════════════════════════════
  let s5 = pres.addSlide();
  slideHead(s5, "Objectives");
  addFooter(s5, 5);

  s5.addText(
    "Based on the literature review and identified research gaps, the project objectives are:",
    { x: 0.5, y: 1.9, w: 9.0, h: 0.35, fontSize: 12, fontFace: F, color: C.textSoft, margin: 0 }
  );

  const objs = [
    "To preprocess the Food-101 dataset with augmentation (rotation, flipping, color jitter, mixup) for robust training [3, 7].",
    "To fine-tune EfficientNetV2-B0 pretrained on ImageNet for 101-class food classification using transfer learning [2].",
    "To build a nutrition mapping layer linking each food class to USDA calorie, protein, fat, and carbohydrate data [4].",
    "To develop a Flask web application allowing photo upload and live camera capture for instant food recognition.",
    "To display per-item and total meal nutritional breakdown with confidence scores.",
    "To evaluate model performance using Top-1 Accuracy, Top-5 Accuracy, and per-class Precision/Recall [3].",
  ];

  let oy = 2.4;
  objs.forEach((obj, i) => {
    s5.addText(`${["I.", "II.", "III.", "IV.", "V.", "VI."][i]}     ${obj}`, {
      x: 0.8, y: oy, w: 8.7, h: 0.55,
      fontSize: 12, fontFace: F, color: C.textSoft, margin: 0, lineSpacingMultiple: 1.3,
    });
    oy += 0.62;
  });


  // ════════════════════════════════════════
  // SLIDE 6 — METHODOLOGY
  // ════════════════════════════════════════
  let s6 = pres.addSlide();
  slideHead(s6, "Proposed Methodology");
  addFooter(s6, 6);

  s6.addText(
    "The proposed system follows a modular pipeline from data preparation to deployment:",
    { x: 0.5, y: 1.9, w: 9.0, h: 0.3, fontSize: 12, fontFace: F, color: C.textSoft, margin: 0 }
  );

  const methSections = [
    { head: "Data Preparation:", body: " Load Food-101 dataset [3]; resize to 224\u00D7224; apply augmentation (RandomHorizontalFlip, RandomRotation, ColorJitter, Normalize to ImageNet stats) [7]." },
    { head: "Model Architecture:", body: " EfficientNetV2-B0 pretrained on ImageNet [2]. Replace final classification head with FC(1280\u2192512\u2192101). Freeze backbone for 5 epochs, then unfreeze top 50 layers for fine-tuning." },
    { head: "Training:", body: " Adam optimizer (lr=1e-4 with cosine annealing), CrossEntropyLoss, batch size 32, 30 epochs. Early stopping on validation loss (patience=5)." },
    { head: "Nutrition Mapping:", body: " JSON lookup table mapping each of the 101 food classes to USDA FoodData Central [4] nutritional values per standard serving size." },
    { head: "Inference Pipeline:", body: " Input image \u2192 preprocess \u2192 EfficientNetV2 \u2192 top-3 predictions with confidence \u2192 nutrition lookup \u2192 display calorie breakdown." },
    { head: "Web Application:", body: " Flask backend serving the trained model. Frontend with upload and camera capture. Results shown with food label, confidence %, and full nutritional table." },
  ];

  let my = 2.35;
  methSections.forEach((m, i) => {
    s6.addText([
      { text: `${i + 1}.  `, options: { bold: true } },
      { text: m.head, options: { bold: true } },
      { text: m.body },
    ], { x: 0.5, y: my, w: 9.0, h: 0.65, fontSize: 11, fontFace: F, color: C.textSoft, margin: 0, lineSpacingMultiple: 1.25 });
    my += 0.72;
  });


  // ════════════════════════════════════════
  // SLIDE 7 — TECHNOLOGY STACK
  // ════════════════════════════════════════
  let s7 = pres.addSlide();
  slideHead(s7, "Technology Stack");
  addFooter(s7, 7);

  s7.addText(
    "The following technologies and tools are used:",
    { x: 0.5, y: 1.9, w: 9.0, h: 0.3, fontSize: 12, fontFace: F, color: C.textSoft, margin: 0 }
  );

  const techRows = [
    [
      { text: "Category", options: { bold: true, fill: { color: C.headerGray }, color: C.text } },
      { text: "Technologies", options: { bold: true, fill: { color: C.headerGray }, color: C.text } },
    ],
    [{ text: "Language", options: { color: C.textSoft } }, { text: "Python 3.10+", options: { color: C.textSoft } }],
    [{ text: "Deep Learning", options: { color: C.textSoft } }, { text: "PyTorch, torchvision (MPS acceleration on Apple Silicon)", options: { color: C.textSoft } }],
    [{ text: "Model", options: { color: C.textSoft } }, { text: "EfficientNetV2-B0 (pretrained on ImageNet) [2]", options: { color: C.textSoft } }],
    [{ text: "Data Processing", options: { color: C.textSoft } }, { text: "Pandas, NumPy, Pillow, torchvision.transforms", options: { color: C.textSoft } }],
    [{ text: "Web Framework", options: { color: C.textSoft } }, { text: "Flask", options: { color: C.textSoft } }],
    [{ text: "Frontend", options: { color: C.textSoft } }, { text: "HTML5, CSS3, JavaScript (vanilla)", options: { color: C.textSoft } }],
    [{ text: "Nutrition Data", options: { color: C.textSoft } }, { text: "USDA FoodData Central API / JSON [4]", options: { color: C.textSoft } }],
    [{ text: "Visualization", options: { color: C.textSoft } }, { text: "Matplotlib, Seaborn (training curves, confusion matrix)", options: { color: C.textSoft } }],
    [{ text: "Platform", options: { color: C.textSoft } }, { text: "Apple M1 Max (MPS), Jupyter Notebook", options: { color: C.textSoft } }],
  ];

  s7.addTable(techRows, {
    x: 0.5, y: 2.3, w: 9.0, colW: [2.8, 6.2],
    fontSize: 10.5, fontFace: F,
    border: { pt: 0.75, color: C.lineSoft },
    rowH: [0.28, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26, 0.26],
    autoPage: false,
  });


  // ════════════════════════════════════════
  // SLIDE 8 — EXPECTED OUTCOMES & TIMELINE
  // ════════════════════════════════════════
  let s8 = pres.addSlide();
  slideHead(s8, "Expected Outcomes & Timeline");
  // No footer on this slide — table needs full space

  s8.addText("Expected Outcomes:", {
    x: 0.5, y: 1.9, w: 9.0, h: 0.3,
    fontSize: 14, fontFace: F, bold: true, color: C.text, margin: 0,
  });

  s8.addText(
    "The system is expected to achieve: Top-1 Accuracy \u2265 85%, Top-5 Accuracy \u2265 95% on the Food-101 test set, " +
    "with calorie estimation within \u00B115% of USDA reference values per serving.",
    { x: 0.5, y: 2.25, w: 9.0, h: 0.4, fontSize: 12, fontFace: F, color: C.textSoft, margin: 0, lineSpacingMultiple: 1.3 }
  );

  s8.addText("Deliverables:", {
    x: 0.5, y: 2.75, w: 9.0, h: 0.3,
    fontSize: 14, fontFace: F, bold: true, color: C.text, margin: 0,
  });

  const deliverables = [
    "Trained EfficientNetV2 model as a deployable artifact (.pth file) [2].",
    "Nutrition mapping JSON linking 101 food classes to USDA data [4].",
    "Flask web application with photo upload and camera capture.",
    "Per-item and total meal calorie/macronutrient breakdown display.",
    "Evaluation report: accuracy, confusion matrix, per-class metrics.",
  ];
  let dy = 3.05;
  deliverables.forEach((d, i) => {
    s8.addText(`${i + 1}.     ${d}`, {
      x: 0.8, y: dy, w: 8.7, h: 0.28,
      fontSize: 11, fontFace: F, color: C.textSoft, margin: 0,
    });
    dy += 0.3;
  });

  s8.addText("Project Timeline (12 Weeks):", {
    x: 0.5, y: 4.65, w: 9.0, h: 0.3,
    fontSize: 14, fontFace: F, bold: true, color: C.text, margin: 0,
  });

  const tlRows = [
    [
      { text: "Phase", options: { bold: true, fill: { color: C.headerGray }, color: C.text } },
      { text: "Weeks", options: { bold: true, fill: { color: C.headerGray }, color: C.text } },
      { text: "Activities", options: { bold: true, fill: { color: C.headerGray }, color: C.text } },
    ],
    [{ text: "I", options: { color: C.textSoft } },    { text: "1\u20132", options: { color: C.textSoft } },   { text: "Literature review & dataset exploration [3]", options: { color: C.textSoft } }],
    [{ text: "II", options: { color: C.textSoft } },   { text: "3", options: { color: C.textSoft } },         { text: "Data preprocessing & augmentation pipeline [7]", options: { color: C.textSoft } }],
    [{ text: "III", options: { color: C.textSoft } },  { text: "4\u20136", options: { color: C.textSoft } },  { text: "EfficientNetV2 training & fine-tuning [2]", options: { color: C.textSoft } }],
    [{ text: "IV", options: { color: C.textSoft } },   { text: "7", options: { color: C.textSoft } },         { text: "Nutrition mapping integration [4]", options: { color: C.textSoft } }],
    [{ text: "V", options: { color: C.textSoft } },    { text: "8\u20139", options: { color: C.textSoft } },  { text: "Flask web app & frontend development", options: { color: C.textSoft } }],
    [{ text: "VI", options: { color: C.textSoft } },   { text: "10\u201311", options: { color: C.textSoft } }, { text: "Testing, evaluation & optimization", options: { color: C.textSoft } }],
    [{ text: "VII", options: { color: C.textSoft } },  { text: "12", options: { color: C.textSoft } },        { text: "Documentation & presentation", options: { color: C.textSoft } }],
  ];
  s8.addTable(tlRows, {
    x: 0.5, y: 4.95, w: 9.0, colW: [0.8, 1.0, 7.2],
    fontSize: 10.5, fontFace: F,
    border: { pt: 0.75, color: C.lineSoft },
    rowH: [0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22],
    autoPage: false,
  });


  // ════════════════════════════════════════
  // SLIDE 9 — REFERENCES
  // ════════════════════════════════════════
  let s9 = pres.addSlide();
  slideHead(s9, "References");
  addFooter(s9, 9);

  const refs = [
    "Schoeller, D.A. (1995). Limitations in the Assessment of Dietary Energy Intake by Self-Report. Metabolism, 44, 18\u201322.",
    "Tan, M., & Le, Q.V. (2021). EfficientNetV2: Smaller Models and Faster Training. Proc. ICML, 10096\u201310106.",
    "Bossard, L., Guillaumin, M., & Van Gool, L. (2014). Food-101 \u2013 Mining Discriminative Components with Random Forests. ECCV, 446\u2013461.",
    "U.S. Department of Agriculture. USDA FoodData Central. fdc.nal.usda.gov.",
    "Mezgec, S., & Korousic Seljak, B. (2017). NutriNet: A Deep Learning Food and Drink Image Recognition System for Dietary Assessment. Nutrients, 9(7), 657.",
    "Myers, A., Johnston, N., Rathod, V., et al. (2015). Im2Calories: Towards an Automated Mobile Vision Food Diary. Proc. ICCV, 1233\u20131241.",
    "Shorten, C., & Khoshgoftaar, T.M. (2019). A Survey on Image Data Augmentation for Deep Learning. J. Big Data, 6, 60.",
    "He, K., Zhang, X., Ren, S., & Sun, J. (2016). Deep Residual Learning for Image Recognition. Proc. CVPR, 770\u2013778.",
  ];

  let ry = 1.9;
  refs.forEach((ref, i) => {
    s9.addText(`[${i + 1}]    ${ref}`, {
      x: 0.5, y: ry, w: 9.0, h: 0.5,
      fontSize: 10, fontFace: F, color: C.textSoft, margin: 0, lineSpacingMultiple: 1.15,
    });
    ry += 0.52;
  });


  // ── SAVE ──
  const outPath = "/Users/akhilraghav/Documents/yashikawork/food-calorie-estimation/synopsis/synopsis.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Saved: " + outPath);
}

createPresentation().catch(console.error);
