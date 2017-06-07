const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Config = imports.misc.config;
const Gio = imports.gi.Gio;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

function _(s) { return s; }

const P_KEY_SU = "su";
const P_KEY_EDITOR = "editor";

function init() {
	//Convenience.initTranslations();
}
		
let counter = 1;

const Settings = new GObject.Class({
	Name: 'Settings',
	Extends: Gtk.Grid,

	_init: function(params) {
		this.parent(params);

		this.margin = 25;
		this.spacing = 30;
		this.row_spacing = 10;
		this.p = Convenience.getSettings();
		
		let su_entry = new Gtk.Entry({halign: Gtk.Align.END});
		su_entry.set_sensitive(true);
		su_entry.text = this.p.get_string(P_KEY_SU);
		this.pushPref(_("GUI SU (beesu/gksu)"), su_entry);
		
		ed_entry = new Gtk.Entry({halign: Gtk.Align.END});
		ed_entry.set_sensitive(true);
		ed_entry.text = this.p.get_string(P_KEY_EDITOR);
		this.pushPref(_("Editor (gedit)"), ed_entry);
		
		let save_btn = new Gtk.Button({label: _("Save")});
		save_btn.connect("clicked", Lang.bind(this, function(w){
			this.p.set_string(P_KEY_SU, su_entry.text);
			this.p.set_string(P_KEY_EDITOR, ed_entry.text);
			this.get_toplevel().close();
		}));
		this.attach(save_btn, 0, counter, 2, 1);
		counter++;

	},
	
	pushPref: function(title, wd) {
		let lb = new Gtk.Label({
			label: _(title),
			hexpand: true,
			halign: Gtk.Align.START
		});
		this.attach(lb, 0, counter, 1, 1);
		this.attach(wd, 1, counter, 1, 1);
		counter++;
	}

});

function buildPrefsWidget() {
	let widget = new Settings();
	widget.show_all();
	return widget;
}


