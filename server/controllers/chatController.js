import ApiError from "../error/ApiError.js";
import Chat from '../models/chat.js';
import ChatMember from '../models/chatMember.js';
import Message from '../models/message.js';
import User from '../models/users.js';

export async function getChats(req, res, next) {
    try {
        const chats = Chat.findAll({
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
                                'id', 'firstName', 'lastName', 'avatarUrl'
                            ]
                        }
                    ]
                }
            ],
            order: [[{ model: Message, as: 'lastMessage' }, 'createdAt', 'DESC']]
        });

        return res.json(chats);
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
                    'id', 'firstName', 'lastName', 'avatarUrl', 'username'
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
            ...membersIds.map(id => ({chatId: chat.id, userId: id, role: 'member'})),
        ];

        await ChatMember.bulkCreate(members);

        return res.status(201).json(chat);
    } catch (e) {
        next(ApiError.internal('createChat error: ' + e));
    }
}