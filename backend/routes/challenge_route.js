const express = require('express');
const router = express.Router();

const {
    createChallenge,
    deleteChallenge,
    getAllChallenges,
    getSingleChallenge,
    updateChallenge,
    joinChallenges,
    leaveChallenge,
    createChallengeProgress,
    updateChallengeProgress,
    voteForParticipant,
    softDeleteChallenges,
    getAllSoftDeletedChallenges,
    myParticipantChallenges,
    recoverSoftDeletedChallenge,
    removeChallengeProgress,
    ChallengeWinner,
    getPrivateChallenge,
    getAllPrivateChallenges
} = require('../controller/challengeController');
const upload =require('../middleware/fileUpload-middleware')

const authMiddleware = require('../middleware/auth-Middleware'); // middleware to add req.user

router.post('/create', authMiddleware, createChallenge);
router.delete('/delete/:id', authMiddleware, deleteChallenge);

router.get("/get", getAllChallenges);
router.get("/get/:id", getSingleChallenge);
router.get("/get-private/:inviteCode", authMiddleware, getPrivateChallenge);
router.get("/get-all-private", authMiddleware, getAllPrivateChallenges);

// Protected routes
router.put("/update/:id", authMiddleware, updateChallenge);
router.patch("/soft-delete/:id", authMiddleware, softDeleteChallenges);

router.post("/join/:id", authMiddleware, joinChallenges);
router.post("/leave/:id", authMiddleware, leaveChallenge);

router.post("/createprogress/:id", authMiddleware, upload.single('file'), createChallengeProgress);
router.patch("/updateprogress/:id", authMiddleware, upload.single('file') ,updateChallengeProgress);
router.delete('/remove-progress/:id', authMiddleware,removeChallengeProgress);


router.post("/vote/:id", authMiddleware, voteForParticipant);

router.get("/get-soft-deleted", authMiddleware, getAllSoftDeletedChallenges);
router.get("/myparticipant", authMiddleware, myParticipantChallenges);

router.patch("/recover/:id", authMiddleware, recoverSoftDeletedChallenge);
router.post("/winner/:id",authMiddleware, ChallengeWinner);



module.exports = router;
