# Vet Library — مكتبة الطب البيطري

موقع تعليمي بسيط لطلاب كلية الطب البيطري — فرقة واحدة، 7 مواد.

## كيفية إضافة محاضرة جديدة

### الطريقة 1: من GitHub مباشرة (الأسهل)

1. ادخل على مستودع المشروع على GitHub.
2. افتح ملف `data.json`.
3. اضغط على أيقونة القلم (Edit) في الأعلى.
4. أضف محاضرة جديدة في مصفوفة `lectures`:

```json
{
  "id": "lecture-001",
  "subject_id": "internal-medicine",
  "title_ar": "عنوان المحاضرة",
  "title_en": "Lecture Title",
  "html": "lectures/internal/001.html",
  "pdf": "https://drive.google.com/file/d/...",
  "extra": "",
  "notes": "ملاحظة اختيارية"
}