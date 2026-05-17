import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Notice from '../models/Notice.js';
import Payment from '../models/Payment.js';
import Visitor from '../models/Visitor.js';
import Event from '../models/Event.js';
import Staff from '../models/Staff.js';
import Flat from '../models/Flat.js';
import LostFound from '../models/LostFound.js';
import Activity from '../models/Activity.js';
import SOS from '../models/SOS.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany(),
      Complaint.deleteMany(),
      Notice.deleteMany(),
      Payment.deleteMany(),
      Visitor.deleteMany(),
      Event.deleteMany(),
      Staff.deleteMany(),
      Flat.deleteMany(),
      LostFound.deleteMany(),
      Activity.deleteMany(),
      SOS.deleteMany(),
    ]);

    const admin = await User.create({
      name: 'Society Admin',
      email: 'admin@societysync.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
    });

    const resident = await User.create({
      name: 'John Resident',
      email: 'resident@societysync.com',
      password: 'resident123',
      role: 'resident',
      phone: '9876543211',
      flatNumber: 'A-101',
    });

    const resident2 = await User.create({
      name: 'Sarah Kumar',
      email: 'sarah@societysync.com',
      password: 'resident123',
      role: 'resident',
      phone: '9876543212',
      flatNumber: 'A-102',
    });

    const flats = await Flat.insertMany([
      { flatNumber: 'A-101', floor: 1, block: 'A', status: 'Occupied', resident: resident._id },
      { flatNumber: 'A-102', floor: 1, block: 'A', status: 'Occupied', resident: resident2._id },
      { flatNumber: 'A-201', floor: 2, block: 'A', status: 'Vacant' },
      { flatNumber: 'B-101', floor: 1, block: 'B', status: 'Vacant' },
      { flatNumber: 'B-102', floor: 1, block: 'B', status: 'Vacant' },
    ]);

    const staff = await Staff.insertMany([
      { name: 'Ramesh Cleaner', role: 'Cleaner', phone: '9000000001', isAvailable: true },
      { name: 'Suresh Electrician', role: 'Electrician', phone: '9000000002', isAvailable: true },
      { name: 'Mahesh Plumber', role: 'Plumber', phone: '9000000003', isAvailable: false },
      { name: 'Vijay Security', role: 'Security', phone: '9000000004', isAvailable: true },
    ]);

    await Notice.insertMany([
      {
        title: 'Water Supply Disruption',
        content: 'Water supply will be unavailable tomorrow from 10 AM to 2 PM due to tank cleaning.',
        priority: 'Urgent',
        type: 'Water shortage',
        postedBy: admin._id,
        isPinned: true,
      },
      {
        title: 'Society Diwali Celebration',
        content: 'Join us for Diwali celebrations on Nov 12 at the community hall.',
        priority: 'Event',
        type: 'Festival',
        postedBy: admin._id,
      },
      {
        title: 'Lift Maintenance',
        content: 'Lift B will be under maintenance this weekend. Please use stairs.',
        priority: 'Maintenance',
        type: 'Maintenance work',
        postedBy: admin._id,
      },
      {
        title: 'Cleaner on Leave',
        content: 'Society cleaner will be unavailable on Friday. Please manage waste accordingly.',
        priority: 'General',
        type: 'Cleaner unavailable',
        postedBy: admin._id,
      },
    ]);

    await Complaint.insertMany([
      {
        title: 'Water leakage in bathroom',
        description: 'There is continuous water leakage from the ceiling.',
        category: 'Water',
        status: 'Pending',
        resident: resident._id,
        flatNumber: 'A-101',
        timeline: [{ status: 'Pending', note: 'Complaint submitted' }],
      },
      {
        title: 'Lift not working',
        description: 'Lift B stopped working since morning.',
        category: 'Lift Issue',
        status: 'In Progress',
        resident: resident2._id,
        flatNumber: 'A-102',
        assignedStaff: staff[0]._id,
        timeline: [
          { status: 'Pending', note: 'Complaint submitted' },
          { status: 'In Progress', note: 'Technician assigned' },
        ],
      },
      {
        title: 'Street light not working',
        description: 'Street light near block A is not working.',
        category: 'Electricity',
        status: 'Resolved',
        resident: resident._id,
        flatNumber: 'A-101',
        assignedStaff: staff[1]._id,
        timeline: [
          { status: 'Pending', note: 'Complaint submitted' },
          { status: 'In Progress', note: 'Electrician assigned' },
          { status: 'Resolved', note: 'Issue fixed' },
        ],
      },
    ]);

    const now = new Date();
    await Payment.insertMany([
      {
        resident: resident._id,
        flatNumber: 'A-101',
        amount: 3500,
        fine: 0,
        totalAmount: 3500,
        month: 'April',
        year: 2026,
        dueDate: new Date(now.getFullYear(), now.getMonth(), 10),
        paidDate: new Date(),
        status: 'Paid',
        paymentMode: 'UPI',
        receiptNumber: 'RCP-1001',
      },
      {
        resident: resident._id,
        flatNumber: 'A-101',
        amount: 3500,
        fine: 175,
        totalAmount: 3675,
        month: 'May',
        year: 2026,
        dueDate: new Date(now.getFullYear(), now.getMonth(), 5),
        status: 'Overdue',
      },
      {
        resident: resident2._id,
        flatNumber: 'A-102',
        amount: 3500,
        fine: 0,
        totalAmount: 3500,
        month: 'May',
        year: 2026,
        dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 10),
        status: 'Pending',
      },
    ]);

    await Visitor.insertMany([
      {
        visitorName: 'Amit Sharma',
        flatNumber: 'A-101',
        purpose: 'Family visit',
        expectedDate: new Date(Date.now() + 86400000),
        status: 'Expected',
        resident: resident._id,
      },
      {
        visitorName: 'Delivery Agent',
        flatNumber: 'A-102',
        purpose: 'Package delivery',
        expectedDate: new Date(),
        status: 'Approved',
        resident: resident2._id,
        approvedBy: resident2._id,
      },
    ]);

    await Event.insertMany([
      {
        title: 'Monthly Society Meeting',
        description: 'Discuss maintenance budget and security updates.',
        category: 'Society meeting',
        date: new Date(Date.now() + 7 * 86400000),
        location: 'Community Hall',
        createdBy: admin._id,
        rsvps: [resident._id],
      },
      {
        title: 'Cricket Tournament',
        description: 'Annual society cricket tournament for all age groups.',
        category: 'Sports',
        date: new Date(Date.now() + 14 * 86400000),
        location: 'Society Ground',
        createdBy: admin._id,
        rsvps: [resident._id, resident2._id],
      },
    ]);

    await LostFound.insertMany([
      {
        title: 'Lost House Keys',
        description: 'Set of keys with blue keychain lost near parking.',
        type: 'Lost',
        location: 'Parking Area',
        contactInfo: 'A-101',
        postedBy: resident._id,
      },
      {
        title: 'Found Wallet',
        description: 'Brown leather wallet found near lift B.',
        type: 'Found',
        location: 'Lift B',
        contactInfo: 'Security Desk',
        postedBy: admin._id,
      },
    ]);

    await Activity.insertMany([
      { type: 'system', message: 'Database seeded successfully', user: admin._id },
      { type: 'notice', message: 'Water shortage notice posted', user: admin._id },
      { type: 'complaint', message: 'New complaint: Water leakage', user: resident._id },
    ]);

    console.log('Seed data created successfully!');
    console.log('Admin: admin@societysync.com / admin123');
    console.log('Resident: resident@societysync.com / resident123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
