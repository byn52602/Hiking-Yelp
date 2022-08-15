const Hiking = require('../models/Hiking');

module.exports.index = async (req, res) => {
    const hikings = await Hiking.find();
    res.render('hiking/index', { hikings })
}


module.exports.renderNewForm = (req, res) => {
    res.render('hiking/new');
}

module.exports.createNewTrail = async (req, res) => {
    const newHiking = new Hiking(req.body.hiking);
    newHiking.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    await newHiking.save();
    console.log(newHiking)
    req.flash('success', "Successfully added a new hiking trail");
    res.redirect(`/hiking/${newHiking._id}`)
}

module.exports.showOneTrail = async (req, res) => {
    const { id } = req.params;
    const hiking = await Hiking.findById(id).populate('reviews');
    if (!hiking) {
        req.flash('error', "Cannot find that hiking trail!");
        return res.redirect('/hiking')
    }
    res.render('hiking/show', { hiking })
}

module.exports.renderUpdateForm = async (req, res) => {
    const { id } = req.params;
    const hiking = await Hiking.findById(id);
    if (!hiking) {
        req.flash('error', "Cannot find that hiking trail!");
        return res.redirect('/hiking')
    }
    res.render('hiking/edit', { hiking })

}

module.exports.updateTrail = async (req, res) => {
    const { id } = req.params;
    const hiking = await Hiking.findByIdAndUpdate(id, { ...req.body.hiking });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    hiking.image.push(...imgs); // cannot pass in an array directly
    await hiking.save();
    req.flash('success', "Successfully updated this hiking trail");
    res.redirect(`/hiking/${hiking._id}`)
}

module.exports.deleteTrail = async (req, res) => {
    const { id } = req.params;
    const hiking = await Hiking.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted a hiking trail");
    res.redirect('/hiking')
}

