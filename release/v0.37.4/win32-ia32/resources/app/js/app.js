var app = new Vue({
  el: '#urinal-checkmate',

  data: {
    database: 'data/data.json',
    page: { message: 'loading...' },
    restroom: {},
    stage: 0,
    score: 0,
    attempt: 0,
    urinals: null,
    reload: false,
    endgame: false
  },

  ready: function() {
    if (Modernizr.touch) {
      this.page.message = 'Play it on your desktop browser'
    } else {
      this.import()
    }
  },

  watch: {
    'page.message': function (nuval, olval) {
      console.log('new: %s, old: %s', nuval, olval)

      if (nuval == 'checkmate') {
        if (this.attempt <= 1) {
          this.score++
        }

        this.reload = true
      }
    },

    'restroom': function() {
      if (typeof null == 'object') {
        this.urinals = this.restroom[this.stage].urinals
        return this.urinals
      }
    },

    'stage': function() {
      if (typeof null == 'object') {
        this.urinals = this.restroom[this.stage].urinals
        return this.urinals
      }
    }
  },

  computed: {
    checkmate: function() {
      var result = this.restroom[this.stage].checkmate - 1
      if (result < 0) {
        result = 0
      }
      return result
    },

    enemy: function() {
      var enemies = this.restroom[this.stage].enemies
      var enemy = []
      for (i = 0; i < enemies.length; i++) {
        enemy.push(enemies[i] -1);
      }
      return enemy
    }
  },

  directives: {
    include: function() {
      var url = this.expression
      var that = this
      var request = new XMLHttpRequest()
      request.open('GET', url, true)
      request.onreadystatechange = function() {
        if (this.readyState !== 4) return
        if (this.status !== 200) return
        that.el.innerHTML = this.responseText
      }
      request.send();
    },

    draggable: {
      bind: function() {
        this.el.draggable = 'true',
        this.el.ondragstart = function(ev) {
          ev.dataTransfer.setData('text', ev.target.id)
          this.classList.add('dragging')
          console.log('dragging...')
        }

        this.el.ondragend = function() {
          this.classList.remove('dragging')
        }
      }
    },

    droppable: {
      update: function(drop) {
        var selected = drop
        this.el.ondrop = function(ev) {
          ev.preventDefault()
          ev.stopPropagation()
          var data = ev.dataTransfer.getData('text')
          selected(this.id)
          this.appendChild(document.getElementById(data))
          return false
        }

        this.el.ondragover = function(ev) {
          ev.preventDefault();
        }
      }
    }
  },

  methods: {
    import: function() {
      var that = this
      var request = new XMLHttpRequest()
      request.open('GET', this.database)
      request.onload = function () {
        var result = JSON.parse(request.responseText)
        that.page = result.page
        that.restroom = result.restroom
      }
      request.send();
    },

    drop: function(urinal) {
      if (urinal == 'correct') {
        this.page.message = 'checkmate'
      } else {
        this.page.message = 'wrong'
      }
      this.attempt++
    },

    comeback: function() {
      var entrance = document.getElementById('start-position')
      var man = document.getElementById('man')
      entrance.appendChild(man)
    },

    continue: function() {
      var last = this.restroom.length - 1
      if (this.stage >= last) {
        this.stage = last
        this.endgame = true
        this.page.message = 'Game Over'
      } else {
        this.stage++
        this.reload = false
        this.attempt = 0
        this.import()
        this.comeback()
      }
    },

    restart: function() {
      location.reload()
    }
  }

});
