import ApiError from "../error/ApiError.js";
import Chat from '../models/chat.js';
import ChatMember from '../models/chatMember.js';
import Message from '../models/message.js';
import User from '../models/users.js';

export async function getChats(req, res, next) {
    try {
        const chats = await Chat.findAll({
            include: [
                {
                    model: ChatMember,
                    as: 'members',
                    where: { userId: req.user.id, leftAt: null },
                    attributes: []
                },
                {
                    model: Message,
                    as: 'lastMessage',
                    include: [
                        {
                            model: User,
                            as: 'sender',
                            attributes: [
                                'id', 'firstName', 'lastName', 'avatarUrl', 'publicId', 'username', 'role'
                            ]
                        }
                    ]
                },
                {
                    model: ChatMember,
                    as: 'allMembers',
                    attributes: ['userId', 'role'],
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['id', 'firstName', 'lastName', 'avatarUrl', 'publicId', 'username', 'role'],
                    }],
                },
            ],
            order: [[{ model: Message, as: 'lastMessage' }, 'createdAt', 'DESC']]
        });

        const result = chats.map(chat => {
            const plain = chat.get({ plain: true });

            if (plain.type === 'direct') {
                const companion = plain.allMembers 
                    ?.find(m => m.userId !== req.user.id)
                    ?.user ?? null;
                
                return { ...plain, companion };
            }

            return plain;
        })

        return res.json(result);
    } catch (e) {
        next(ApiError.internal('getChats error: ' + e));
    }
}

export async function getChatById(req, res, next) {
    try {
        const chat = await Chat.findOne({
            where: { id: req.params.chatId },
            include: [
                {
                    model: ChatMember, as: 'members',
                    where: { userId: req.user.id, leftAt: null },
                    attributes: []
                },
            ]
        });

        if (!chat) return next(ApiError.notFound('CHAT_NOT_FOUND'));

        return res.json(chat);
    } catch (e) {
        next(ApiError.internal('getChatById error: ' + e));
    }
}

export async function getChatMembers(req, res, next) {
    try {
        const isMember = await ChatMember.findOne({
            where: { chatId: req.params.chatId, userId: req.user.id, leftAt: null },
        });

        if (!isMember) return next(ApiError.forbidden('FORBIDDEN_ACCESS'));

        const members = await ChatMember.findAll({
            where: { chatId: req.params.chatId, leftAt: null },
            include: [{
                model: User,
                as: 'user',
                attributes: [
                    'id', 'firstName', 'lastName', 'avatarUrl', 'username', 'publicId'
                ],
            }]
        });


        return res.json(members);
    } catch (e) {
        next(ApiError.internal('getChatMembers error: ' + e));
    }
}

export async function createChat(req, res, next) {
    try {
        const { type, name, memberIds } = req.body;

        if (type === 'group' && !name) return next(ApiError.badRequest('GROUP_NAME_REQUIRED'));
        if (!memberIds?.length) return next(ApiError.badRequest('MEMBER_IDS_REQUIRED'));

        const chat = await Chat.create({
            type, name, createdBy: req.user.id
        });

        const members = [
            { chatId: chat.id, userId: req.user.id, role: 'owner' },
            ...memberIds.map(id => ({chatId: chat.id, userId: id, role: 'member'})),
        ];

        await ChatMember.bulkCreate(members);

        return res.status(201).json(chat);
    } catch (e) {
        next(ApiError.internal('createChat error: ' + e));
    }
}

export async function addMember(req, res, next) {
    try {
        const { userId } = req.body;
        const { chatId } = req.params;

        const requester = await ChatMember.findOne({
            where: { chatId, userId: req.user.id, leftAt: null },
        });

        if (!requester || requester.role === 'member') return next(ApiError.forbidden('USER_NOT_ADMIN'));

        const member = await ChatMember.create({chatId, userId, role: 'member'});

        return res.status(201).json(member);
    } catch (e) {
        next(ApiError.internal('addMember error: ' + e));
    }
}

export async function updateChat(req, res, next) {
    try {
        const { name, description, avatarUrl } = req.body;
        const { chatId } = req.params;

        const requester = await ChatMember.findOne({
            where: { chatId, userId: req.user.id, leftAt: null },
        });
        if (!requester || requester.role === 'member') return next(ApiError.forbidden('USER_NOT_ADMIN'));
        
        const chat = await Chat.findByPk(chatId);
        if (!chat) return next(ApiError.notFound('CHAT_NOT_FOUND'));

        await chat.update({name, description, avatarUrl});
        return res.json(chat);
    } catch (e) {
        next(ApiError.internal('updateChat error: ' + e));
    }
}

export async function removeMember(req, res, next) {
    try {
        const { chatId, userId } = req.params;

        const requester = await ChatMember.findOne({
            where: { chatId, userId: req.user.id, leftAt: null },
        });

        const isSelf = String(userId) === (req.user.id);
        if(!isSelf && (!requester || requester.role === 'member')) {
            return next(ApiError.forbidden('USER_NOT_ADMIN'));
        }

        await ChatMember.update(
            { leftAt: new Date() },
            { where: { chatId, userId } }
        );

        return res.status(204).send();
    } catch (e) {
        next(ApiError.internal('removeMember error: ' + e));
    }
}

export async function deleteChat(req, res, next) {
    try {
        const { chatId } = req.params;

        const requester = await ChatMember.findOne({
            where: { chatId, userId: req.user.id, leftAt: null },
        });
        if (!requester || requester.role === 'member') return next(ApiError.forbidden('USER_NOT_ADMIN'));

        await Chat.destroy({ where: { id: chatId } });
        return res.status(204).send();
    } catch (e) {
        next(ApiError.internal('deleteChat error: ' + e));
    }
}

export async function uploadGroupAvatar(req, res, next) {
    try {
        if (!req.file) {
            return next(ApiError.badRequest('GROUP_AVATAR_REQUIRED'));
        }

        const avatarUrl = `/static/${req.file.filename}`;

        res.json({
            success: true,
            avatarUrl
        });
    } catch (e) {
        next(ApiError.internal("Upload group image error: " + e));
    }
}