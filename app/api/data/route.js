import { db } from '@/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

// eslint-disable-next-line
export async function GET(request) {
  try {
    let data;
    const notesDocID = headers().get('notesDocID');
    const notesRef = doc(db, 'notes', notesDocID);
    const notesSnap = await getDoc(notesRef);
    if (!notesSnap.exists()) {
      return NextResponse.json(
        { error: 'getting error while retriving notes data.' },
        { status: 500 },
      );
    }
    data = notesSnap.data();
    return NextResponse.json({ result: data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}
