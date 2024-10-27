import { NextResponse } from 'next/server'

let watchlist = []; 


export async function POST(req) {
    let passedValue = await new NextResponse(req.body).text();
    let bodyreq = JSON.parse(passedValue);

    if (bodyreq) {
        watchlist.push(bodyreq);

        return new Response(
            JSON.stringify({
                message: 'Movie added to the watchlist successfully',
                watchlist: watchlist,
                status: 200
            }),
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    return new Response(
        JSON.stringify({ error: 'Movie data is required' }),
        { status: 400 }
    );
}
export async function GET(request) {
    return new Response(JSON.stringify(watchlist), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('id');
  
    if (!movieId) {
      return new Response(
        JSON.stringify({ error: "Movie ID is required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  
    watchlist = watchlist.filter(movie => movie.id !== movieId);
  
    return new Response(JSON.stringify(watchlist), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  