let activeUploadedImage = '';
let activeUploadedVideo = '';

// دالة التنقل بين الشاشات الرئيسية
function switchTab(tabId) {
    const homeView = document.getElementById('homeView');
    const videosView = document.getElementById('videosView');
    const profileView = document.getElementById('profileView');

    if (homeView) homeView.classList.add('hidden');
    if (videosView) videosView.classList.add('hidden');
    if (profileView) profileView.classList.add('hidden');

    let targetId = tabId;
    if (tabId === 'home') targetId = 'homeView';
    else if (tabId === 'videos') targetId = 'videosView';
    else if (tabId === 'profile') targetId = 'profileView';

    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log("تم الانتقال بنجاح إلى الشاشة: " + tabId);
    } else {
        console.error("القسم المطلوب غير موجود في الـ HTML: " + targetId);
    }
}
window.switchTab = switchTab;

// دالة التنقل بين أقسام الملف الشخصي
function switchProfileSection(section) {
    const secPosts = document.getElementById('sectionPosts');
    const secAbout = document.getElementById('sectionAbout');
    const secPhotos = document.getElementById('sectionPhotos');
    const secVideos = document.getElementById('sectionVideos');

    const btnPosts = document.getElementById('btnProfilePosts');
    const btnAbout = document.getElementById('btnProfileAbout');
    const btnPhotos = document.getElementById('btnProfilePhotos');
    const btnVideos = document.getElementById('btnProfileVideos');

    if (secPosts) secPosts.classList.add('hidden');
    if (secAbout) secAbout.classList.add('hidden');
    if (secPhotos) secPhotos.classList.add('hidden');
    if (secVideos) secVideos.classList.add('hidden');

    [btnPosts, btnAbout, btnPhotos, btnVideos].forEach(btn => {
        if (btn) {
            btn.classList.remove('text-blue-500', 'border-b-2', 'border-blue-500');
            btn.classList.add('text-slate-400');
        }
    });

    if (section === 'posts' && secPosts) {
        secPosts.classList.remove('hidden');
        if (btnPosts) {
            btnPosts.classList.add('text-blue-500', 'border-b-2', 'border-blue-500');
            btnPosts.classList.remove('text-slate-400');
        }
    } else if (section === 'about' && secAbout) {
        secAbout.classList.remove('hidden');
        if (btnAbout) {
            btnAbout.classList.add('text-blue-500', 'border-b-2', 'border-blue-500');
            btnAbout.classList.remove('text-slate-400');
        }
    } else if (section === 'photos' && secPhotos) {
        secPhotos.classList.remove('hidden');
        if (btnPhotos) {
            btnPhotos.classList.add('text-blue-500', 'border-b-2', 'border-blue-500');
            btnPhotos.classList.remove('text-slate-400');
        }
    } else if (section === 'videos' && secVideos) {
        secVideos.classList.remove('hidden');
        if (btnVideos) {
            btnVideos.classList.add('text-blue-500', 'border-b-2', 'border-blue-500');
            btnVideos.classList.remove('text-slate-400');
        }
    }
}
window.switchProfileSection = switchProfileSection;

function handleFileSelect(event, targetInputId, previewContainerId, type) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Data = e.target.result;
        const container = document.getElementById(previewContainerId);
        document.getElementById(targetInputId).value = file.name;
        
        container.classList.remove('hidden');
        container.innerHTML = '';

        if (type === 'image') {
            activeUploadedImage = base64Data;
            activeUploadedVideo = '';
            container.innerHTML = `<img src="${base64Data}" class="w-full max-h-52 object-contain mx-auto rounded-lg">`;
        } else if (type === 'video') {
            activeUploadedVideo = base64Data;
            activeUploadedImage = '';
            container.innerHTML = `<video src="${base64Data}" controls class="w-full max-h-52 mx-auto rounded-lg"></video>`;
        }
    };
    reader.readAsDataURL(file);
}

function containsPhoneNumber(text) {
    if (!text) return false;
    const phoneRegex = /(\+?\d[\d\-\s]{7,}\d)/;
    return phoneRegex.test(text);
}

function previewMedia(imgInputId, videoInputId, previewContainerId) {
    const imgUrl = document.getElementById(imgInputId).value.trim();
    const videoUrl = document.getElementById(videoInputId).value.trim();
    const container = document.getElementById(previewContainerId);

    if (!activeUploadedImage && !activeUploadedVideo) {
        container.innerHTML = '';
        if (imgUrl) {
            container.classList.remove('hidden');
            container.innerHTML = `<img src="${imgUrl}" class="w-full max-h-52 object-contain mx-auto rounded-lg">`;
        } else if (videoUrl) {
            container.classList.remove('hidden');
            container.innerHTML = `<video src="${videoUrl}" controls class="w-full max-h-52 mx-auto rounded-lg"></video>`;
        } else {
            container.classList.add('hidden');
        }
    }
}

function toggleEditBio() {
    const bioDisplayMode = document.getElementById('bioDisplayMode');
    const bioEditContainer = document.getElementById('bioEditContainer');
    const editBioBtn = document.getElementById('editBioBtn');

    if (bioEditContainer.classList.contains('hidden')) {
        document.getElementById('inputBio').value = document.getElementById('dispBio').innerText;
        document.getElementById('inputName').value = document.getElementById('dispName').innerText;
        document.getElementById('inputAge').value = document.getElementById('dispAge').innerText;
        document.getElementById('inputDegree').value = document.getElementById('dispDegree').innerText;
        document.getElementById('inputStatus').value = document.getElementById('dispStatus').innerText;
        document.getElementById('inputWork').value = document.getElementById('dispWork').innerText;
        document.getElementById('inputEmail').value = document.getElementById('dispEmail').innerText;

        bioDisplayMode.classList.add('hidden');
        bioEditContainer.classList.remove('hidden');
        editBioBtn.classList.add('hidden');
    } else {
        bioDisplayMode.classList.remove('hidden');
        bioEditContainer.classList.add('hidden');
        editBioBtn.classList.remove('hidden');
    }
}

function saveBio() {
    const newBio = document.getElementById('inputBio').value;
    const newName = document.getElementById('inputName').value;
    const newAge = document.getElementById('inputAge').value;
    const newDegree = document.getElementById('inputDegree').value;
    const newStatus = document.getElementById('inputStatus').value;
    const newWork = document.getElementById('inputWork').value;
    const newEmail = document.getElementById('inputEmail').value;
    
    if (containsPhoneNumber(newBio) || containsPhoneNumber(newName)) {
        alert('عذراً، يُمنع كتابة أرقام التليفونات في البيانات أو النبذة التعريفية!');
        return;
    }

    if (!newName.trim()) {
        alert('الاسم لا يمكن أن يكون فارغاً!');
        return;
    }

    document.getElementById('dispBio').innerText = newBio;
    document.getElementById('dispName').innerText = newName;
    document.getElementById('dispAge').innerText = newAge;
    document.getElementById('dispDegree').innerText = newDegree;
    document.getElementById('dispStatus').innerText = newStatus;
    document.getElementById('dispWork').innerText = newWork;
    document.getElementById('dispEmail').innerText = newEmail;

    document.getElementById('profileUserName').innerText = newName;
    document.getElementById('sidebarUserName').innerText = newName;
    document.getElementById('profileUserWorkHeader').innerText = newWork;

    toggleEditBio();
}

function updateAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            document.getElementById('topAvatarImg').src = imageUrl;
            document.getElementById('sidebarAvatarImg').src = imageUrl;
            document.getElementById('feedBoxAvatarImg').src = imageUrl;
            document.getElementById('profileAvatarImg').src = imageUrl;
            document.getElementById('profileBoxAvatarImg').src = imageUrl;
        }
        reader.readAsDataURL(file);
    }
}

// دالة تحديث صورة الغلاف، تخزينها في collection: cover -> document: profile -> field: pic_cover ونشرها كمنشور
async function updateCover(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        const coverUrl = e.target.result;
        
        // 1. تحديث الصورة في الواجهة فوراً
        const coverImgElement = document.getElementById('coverImg');
        if (coverImgElement) {
            coverImgElement.src = coverUrl;
        }

        // 2. تخزين الرابط في قاعدة البيانات (cover -> profile -> pic_cover)
        if (window.db && window.setDoc && window.doc) {
            try {
                await window.setDoc(window.doc(window.db, "cover", "profile"), {
                    pic_cover: coverUrl,
                    updatedAt: Date.now()
                }, { merge: true });
                console.log("تم تخزين رابط الغلاف في مجموعة cover / مستند profile بنجاح");
            } catch (error) {
                console.error("خطأ أثناء حفظ رابط الغلاف في الداتابيز: ", error);
            }
        }

        // 3. نشر صورة الغلاف كمنشور جديد في الخلاصة
        const currentAvatar = document.getElementById('topAvatarImg')?.src || '';
        const currentName = document.getElementById('dispName')?.innerText || 'مستخدم';
        
        savePostToDatabase({
            name: currentName,
            avatar: currentAvatar,
            text: "قام بتحديث صورة الغلاف الشخصي ✨",
            image: coverUrl,
            video: "",
            timestamp: Date.now(),
            time: 'الآن'
        });
    };
    reader.readAsDataURL(file);
}

function toggleLike(button) {
    button.classList.toggle('text-blue-500');
    button.classList.toggle('font-bold');
    const icon = button.querySelector('i');
    if (button.classList.contains('text-blue-500')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
    } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
    }
}

function createPost() {
    const text = document.getElementById('postText').value;
    const imageInput = document.getElementById('postImage').value;
    const videoInput = document.getElementById('postVideo').value;
    const currentAvatar = document.getElementById('topAvatarImg').src;
    const currentName = document.getElementById('dispName').innerText;

    const finalImage = activeUploadedImage || imageInput;
    const finalVideo = activeUploadedVideo || videoInput;

    if (!text.trim() && !finalImage && !finalVideo) {
        alert('الرجاء كتابة نص أو إضافة صورة/فيديو للنشر!');
        return;
    }

    if (containsPhoneNumber(text)) {
        alert('عذراً، يُمنع كتابة أرقام التليفونات في المنشورات!');
        return;
    }

    const postData = {
        name: currentName,
        avatar: currentAvatar,
        text: text,
        image: finalImage,
        video: finalVideo,
        timestamp: Date.now(),
        time: 'الآن'
    };

    savePostToDatabase(postData);

    document.getElementById('postText').value = '';
    document.getElementById('postImage').value = '';
    document.getElementById('postVideo').value = '';
    document.getElementById('postPreviewContainer').innerHTML = '';
    document.getElementById('postPreviewContainer').classList.add('hidden');
    activeUploadedImage = '';
    activeUploadedVideo = '';
}

function createProfilePost() {
    const text = document.getElementById('profilePostText').value;
    const imageInput = document.getElementById('profilePostImage').value;
    const videoInput = document.getElementById('profilePostVideo').value;
    const currentAvatar = document.getElementById('topAvatarImg').src;
    const currentName = document.getElementById('dispName').innerText;

    const finalImage = activeUploadedImage || imageInput;
    const finalVideo = activeUploadedVideo || videoInput;

    if (!text.trim() && !finalImage && !finalVideo) {
        alert('الرجاء كتابة شيء أو إضافة صورة/فيديو للنشر!');
        return;
    }

    if (containsPhoneNumber(text)) {
        alert('عذراً، يُمنع كتابة أرقام التليفونات في المنشورات!');
        return;
    }

    const postData = {
        name: currentName,
        avatar: currentAvatar,
        text: text,
        image: finalImage,
        video: finalVideo,
        timestamp: Date.now(),
        time: 'الآن'
    };

    savePostToDatabase(postData);

    document.getElementById('profilePostText').value = '';
    document.getElementById('profilePostImage').value = '';
    document.getElementById('profilePostVideo').value = '';
    document.getElementById('profilePreviewContainer').innerHTML = '';
    document.getElementById('profilePreviewContainer').classList.add('hidden');
    activeUploadedImage = '';
    activeUploadedVideo = '';
}

async function savePostToDatabase(postData) {
    if (!window.db) {
        alert("قاعدة البيانات غير متصلة بعد!");
        return;
    }
    try {
        await window.addDoc(window.collection(window.db, "posts"), postData);
        console.log("تم حفظ المنشور في الداتابيز بنجاح[cite: 4]");
        loadPostsFromDatabase();
    } catch (error) {
        console.error("حدث خطأ أثناء حفظ المنشور: ", error);
        alert("فشل الحفظ في قاعدة البيانات.");
    }
}

async function loadPostsFromDatabase() {
    const feedContainer = document.getElementById('postsFeed');
    const profileFeedContainer = document.getElementById('profilePostsFeed');
    
    if (!window.db) return;

    try {
        const q = window.query(window.collection(window.db, "posts"), window.orderBy("timestamp", "desc"));
        const querySnapshot = await window.getDocs(q);
        
        let postsHTML = '';
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            let mediaContent = '';
            if (data.image) {
                mediaContent = `<div class="w-full bg-black mb-2"><img src="${data.image}" class="w-full max-h-96 object-cover"></div>`;
            } else if (data.video) {
                mediaContent = `<div class="w-full bg-black p-2 mb-2"><video src="${data.video}" controls class="w-full max-h-96 rounded-lg"></video></div>`;
            }

            postsHTML += `
                <div class="bg-slate-800 rounded-xl shadow-md border border-slate-700 overflow-hidden mb-4">
                    <div class="flex items-center justify-between p-4">
                        <div class="flex items-center gap-3">
                            <img src="${data.avatar}" class="w-10 h-10 rounded-full object-cover">
                            <div>
                                <h4 class="font-bold text-slate-100 text-sm">${data.name}</h4>
                                <span class="text-xs text-slate-400">${data.time} · <i class="fa-solid fa-earth-americas"></i></span>
                            </div>
                        </div>
                    </div>
                    <div class="px-4 pb-3 text-slate-200 text-sm">${data.text}</div>
                    ${mediaContent}
                    <div class="grid grid-cols-3 p-1 border-t border-slate-700 text-slate-300 text-sm">
                        <button onclick="toggleLike(this)" class="flex items-center justify-center gap-2 py-2 hover:bg-slate-700 rounded-lg transition"><i class="fa-regular fa-thumbs-up"></i> إعجاب</button>
                        <button class="flex items-center justify-center gap-2 py-2 hover:bg-slate-700 rounded-lg transition"><i class="fa-regular fa-comment"></i> تعليق</button>
                        <button class="flex items-center justify-center gap-2 py-2 hover:bg-slate-700 rounded-lg transition"><i class="fa-solid fa-share"></i> مشاركة</button>
                    </div>
                </div>
            `;
        });

        if (feedContainer) feedContainer.innerHTML = postsHTML;
        if (profileFeedContainer) profileFeedContainer.innerHTML = postsHTML;

    } catch (error) {
        console.error("خطأ في جلب المنشورات: ", error);
    }
}

// دالة لجلب واستعراض صورة الغلاف المحفوظة من الداتابيز عند فتح الصفحة
async function loadCoverFromDatabase() {
    if (!window.db || !window.getDoc || !window.doc) return;
    try {
        const docRef = window.doc(window.db, "cover", "profile");
        const docSnap = await window.getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.pic_cover) {
                const coverImgElement = document.getElementById('coverImg');
                if (coverImgElement) {
                    coverImgElement.src = data.pic_cover;
                }
            }
        }
    } catch (error) {
        console.error("خطأ في جلب صورة الغلاف:", error);
    }
}

// تحميل المنشورات وصورة الغلاف تلقائياً عند فتح الصفحة
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.db) {
            loadCoverFromDatabase();
            loadPostsFromDatabase();
        }
    }, 1000);
});
