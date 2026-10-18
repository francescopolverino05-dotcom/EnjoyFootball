import Foundation
import Vision
import AppKit

let args = CommandLine.arguments
guard args.count > 1 else {
    fputs("usage: ocr <image>\n", stderr)
    exit(1)
}
let url = URL(fileURLWithPath: args[1])
guard let img = NSImage(contentsOf: url),
      let tiff = img.tiffRepresentation,
      let rep = NSBitmapImageRep(data: tiff),
      let cg = rep.cgImage else {
    fputs("failed to load image\n", stderr)
    exit(2)
}

let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.usesLanguageCorrection = false
request.recognitionLanguages = ["it-IT", "en-US"]

let handler = VNImageRequestHandler(cgImage: cg, options: [:])
try handler.perform([request])
let observations = request.results ?? []
for obs in observations {
    guard let cand = obs.topCandidates(1).first else { continue }
    let box = obs.boundingBox
    print(String(format: "%.3f\t%.3f\t%.3f\t%.3f\t%@\t%@",
                 box.origin.x, box.origin.y, box.size.width, box.size.height,
                 String(format: "%.2f", cand.confidence), cand.string))
}
