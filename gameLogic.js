import { supabase } from './supabaseClient.js';

export class GomokuGame {
  constructor() {
    this.board = Array(25).fill(null);
    this.currentPlayer = 'black';
    this.roomId = null;
    this.playerRole = null;
  }

  async createRoom() {
    const { data, error } = await supabase
      .from('rooms')
      .insert({ board: this.board, current_player: 'black', status: 'waiting' })
      .select();
    if (error) throw error;
    this.roomId = data[0].id;
    this.playerRole = 'player1';
    return this.roomId;
  }

  async joinRoom(roomId) {
    const { data, error } = await supabase
      .from('rooms')
      .update({ status: 'playing' })
      .eq('id', roomId)
      .eq('status', 'waiting')
      .select();
    if (error) throw error;
    if (data.length === 0) throw new Error('房间已满或不存在');
    this.roomId = roomId;
    this.playerRole = 'player2';
    this.board = data[0].board;
  }

  async makeMove(position) {
    if (this.board[position]) throw new Error('该位置已有棋子');
    
    const player = this.playerRole === 'player1' ? 'black' : 'white';
    if (player !== this.currentPlayer) throw new Error('不是你的回合');

    this.board[position] = player;
    const nextPlayer = player === 'black' ? 'white' : 'black';

    const { data, error } = await supabase
      .from('rooms')
      .update({ board: this.board, current_player: nextPlayer })
      .eq('id', this.roomId)
      .select();

    if (error) throw error;
    this.currentPlayer = nextPlayer;
    
    const winner = this.checkWinner();
    if (winner) {
      await supabase.from('rooms').update({ status: 'ended', winner }).eq('id', this.roomId);
    }
    
    return { winner };
  }

  checkWinner() {
    const lines = [
      [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24],
      [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24],
      [0,6,12,18,24], [4,8,12,16,20]
    ];

    for (const line of lines) {
      const cells = line.map(i => this.board[i]);
      if (cells.every(c => c === 'black')) return 'black';
      if (cells.every(c => c === 'white')) return 'white';
    }
    return null;
  }

  subscribe(callback) {
    return supabase
      .channel(`room:${this.roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${this.roomId}`
      }, payload => {
        if (payload.new) {
          this.board = payload.new.board;
          this.currentPlayer = payload.new.current_player;
          callback(payload.new);
        }
      })
      .subscribe();
  }

  static async getRooms() {
    const { data, error } = await supabase
      .from('rooms')
      .select('id, created_at')
      .eq('status', 'waiting')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
}
