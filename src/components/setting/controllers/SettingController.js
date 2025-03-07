const editProfileService = require('../services/EditProfileService');
const upload = require('../../../config/cloudinaryConfig');
const { mongooseToObject } = require('../../../utils/mongoose');
const cloudinary = require('cloudinary').v2;


class SettingController {
    async editProfile(req, res, next){
        const profile = await editProfileService.getProfile(req.user._id); 
        res.render('edit-profile', {profile});
    }
    // Cập nhật thông tin chung và avatar
    updateGeneral(req, res, next) {
        upload.single('avatar')(req, res,async function (err) {
        try {
            const { username, name } = req.body;
            const avatarUrl = req.file ? req.file.path : null;
            
            const currentProfile = await editProfileService.getProfile(req.user._id);

            // Logic cập nhật vào database
            const updatedData = { username, name };
            if (avatarUrl) {
                // Xóa ảnh cũ nếu có
                if (currentProfile.avatar && currentProfile.avatar !== '/img/default-avatar') {
                    const publicId = currentProfile.avatar.split('/').slice(-2).join('/').split('.')[0];
                    cloudinary.uploader.destroy(publicId, (error, result) => {
                        if (error) {
                            console.error('Failed to delete old avatar:', error);
                        } else {
                            console.log('Old avatar deleted:', result);
                        }
                    });
                }
                updatedData.avatar = avatarUrl;
            }
        
            const profile = await editProfileService.updateProfile(req.user._id, {username, name, avatarUrl});

            res.render('edit-profile', { profile : mongooseToObject(profile), successMessage: "Cập nhật thành công" });
            
        } catch (error) {
            const profile = await editProfileService.getProfile(req.user._id);
            res.render('edit-profile', { profile : mongooseToObject(profile), errorMessage: error });
        }
    })};
  
    // Cập nhật mật khẩu
    async updatePassword(req, res, next) {
        try {
            const { currentPassword, newPassword, repeatNewPassword } = req.body;
        
            if (newPassword !== repeatNewPassword) {
                return res.status(400).json({ message: 'Mật khẩu mới không khớp.' });
            }
            
            // Logic cập nhật mật khẩu vào database
            const profile = await editProfileService.updateProfile(req.user._id,{ currentPassword, newPassword});
            
            res.status(200).json( { profile : mongooseToObject(profile), successMessage: "Cập nhật thành công" });

        } catch (error) {
            res.status(400).json({ message: error.message });
        };
    }
  
    // Cập nhật thông tin liên hệ
    async updateInfo(req, res) {
        try {
        const { birthday, address, phone, facebook } = req.body;
    
        // Logic lưu thông tin vào database
        const updatedData = { birthday, address, phone, facebook };
        
        const profile = await editProfileService.updateProfile(req.user._id, updatedData);
    
        res.render('edit-profile', { profile : mongooseToObject(profile), successMessage: "Cập nhật thành công" });
        } catch (error) {
            const profile = await editProfileService.getProfile(req.user._id);
            res.render('edit-profile', { profile : mongooseToObject(profile), errorMessage: error });
        }
    };
}

module.exports = new SettingController();