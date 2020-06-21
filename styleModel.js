const StyleModel = class {
	constructor(data) {
		this._name = data.name;
		this._displayName = data.displayName;
		this._color = data.color;
		this._spiral = data.spiral;
		this._width = data.width;
		this._opacity = data.opacity;
		this._tickWidth = data.tickWidth;
	}
	get name(){
		return this._name;
	}
	get displayName(){
		return this._displayName;
	}
	get color(){
		return this._color;
	}
	get spiral(){
		return this._spiral;
	}
	get width(){
		return this._width;
	}
	get tickWidth(){
		return this._tickWidth;
	}
	get opacity(){
		return this._opacity;
	}
};

const create = (data)=>{
	return new StyleModel(data);
};

exports.create = create;
exports.StyleModel = StyleModel;